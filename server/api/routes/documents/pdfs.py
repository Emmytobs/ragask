"""Module for handling PDF document operations."""

from io import BytesIO
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Request

from app_logging import logger
from config import ENV_VARS
from models.documents import CreateDocument, Document
from cloud import get_storage_bucket

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings


from pypdf import PdfReader


router = APIRouter()


def _get_num_pages_from_pdf(document: Document) -> int:
    try:
        bucket = get_storage_bucket()

        blob = bucket.blob(document.name)
        blob_content = blob.download_as_bytes()

        reader = PdfReader(BytesIO(blob_content))
        return len(reader.pages)
    except Exception as e:
        logger.error(str(e))
        return 0


@router.post("/upload", response_description="Upload file")
async def upload_pdf_document(document: CreateDocument, request: Request):

    document = Document(**document.model_dump())

    if document.type != "application/pdf":
        raise HTTPException(status_code=400, detail="only supports PDF uploads")

    document.uploaded_by = request.state.user.id
    document.is_indexed = False

    document.num_pages = _get_num_pages_from_pdf(document)

    result = await Document.insert_one(document)

    return result


@router.get("/index/{document_id}")
async def extract_embeddings(document_id: str):
    document = await Document.find_one({"_id": PydanticObjectId(document_id)})

    if document and document.type == "application/pdf":
        bucket = get_storage_bucket()
        blob = bucket.blob(document.name)
        blob.make_public()

        # TODO: make this safe. unable to use the signed url because PyPDFLoader says the url is too long
        url = blob.public_url

        loader = PyPDFLoader(url)
        data = await loader.aload()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=150
        )

        docs = text_splitter.split_documents(data)

        MongoDBAtlasVectorSearch.from_documents(
            documents=docs,
            embedding=OpenAIEmbeddings(
                api_key=ENV_VARS.openai_api_key, disallowed_special=()
            ),
            collection="document_vectors",
            index_name="document_vectors",
        )
        return docs
