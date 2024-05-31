"""Module for handling PDF document operations."""

from io import BytesIO
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Request, status
from langchain_openai import ChatOpenAI

from app_logging import logger
from config import ENV_VARS
from embeddings import EMBEDDINGS_MODEL
from models.document_vectors import DocumentVectors
from models.documents import CreateDocument, Document
from cloud import get_storage_bucket

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.messages import HumanMessage, SystemMessage


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


def _get_pdf_url(document: Document):
    bucket = get_storage_bucket()
    blob = bucket.blob(document.name)
    # TODO: make this safe. Unable to use the signed url because PyPDFLoader says the url is too long
    blob.make_public()
    return blob.public_url


async def _get_pdf_content(url: str):
    loader = PyPDFLoader(url)
    data = await loader.aload()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)

    docs = text_splitter.split_documents(data)
    return docs


async def _process_document(document: Document):
    url = _get_pdf_url(document)
    docs = await _get_pdf_content(url)
    embeddings = EMBEDDINGS_MODEL.embed_documents([doc.page_content for doc in docs])
    document_vectors = [
        DocumentVectors(
            document_id=document.id,
            embeddings=embeddings[i],
            page_content=docs[i].page_content,
            metadata={
                "page": docs[i].metadata["page"],
                "source": docs[i].metadata["source"],
            },
        )
        for i in range(len(docs))
    ]
    return document_vectors


async def _mark_document_as_indexed(document_id: str):
    await Document.find_one(Document.id == document_id).update(
        {"$set": {Document.is_indexed: True}}
    )


@router.get("/index/{document_id}")
async def extract_embeddings(
    document_id: str,
):
    document = await Document.find_one({"_id": PydanticObjectId(document_id)})

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pdf Document not found"
        )

    if document.is_indexed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pdf Document is already indexed",
        )

    if not document.type == "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Document is not a PDF"
        )

    document_vectors = await _process_document(document)

    result = await DocumentVectors.insert_many(document_vectors)

    if result.acknowledged:
        await _mark_document_as_indexed(document.id)

    return {
        "acknowledged": result.acknowledged,
        "inserted_count": len(result.inserted_ids),
    }


@router.get("/related/{document_id}")
async def get_related_docs(query: str, document_id: str):
    docs = await DocumentVectors.get_related_chunks(query, document_id)
    return {"docs": docs}


@router.get("/chat/{document_id}")
async def chat_with_document(document_id: str, query: str):

    docs = await DocumentVectors.get_related_chunks(query, document_id)

    context = "\n\n".join([doc["page_content"] for doc in docs])

    chat = ChatOpenAI(model="gpt-3.5-turbo-0125", api_key=ENV_VARS.openai_api_key)

    messages = [
        SystemMessage(
            content=f"You're a helpful assistant. Given the content of this document answer the human question: Context: {context} "
        ),
        HumanMessage(content=query),
    ]

    response = chat.invoke(messages)

    return {"response": response.content, "docs": docs}
