"""Module for handling file-related routes in the API."""

from io import BytesIO
from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Request

from app_logging import logger
from models.files import CreateFile, File
from cloud import get_storage_bucket

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from pypdf import PdfReader

router = APIRouter()


def _get_num_pages_from_pdf(file: File) -> int:
    try:
        bucket = get_storage_bucket()

        blob = bucket.blob(file.name)
        blob_content = blob.download_as_bytes()

        reader = PdfReader(BytesIO(blob_content))
        return len(reader.pages)
    except Exception as e:
        logger.error(str(e))
        return 0


@router.post("/upload-pdf", response_description="Upload file")
async def upload_pdf_file(file: CreateFile, request: Request):

    file = File(**file.model_dump())

    if file.type != "application/pdf":
        raise HTTPException(status_code=400, detail="only supports PDF uploads")

    file.uploaded_by = request.state.user.id
    file.is_indexed = False

    file.num_pages = _get_num_pages_from_pdf(file)

    result = await File.insert_one(file)

    return result


@router.get("/embed/{file_id}")
async def extract_embeddings(file_id: str) -> List[Document]:
    file = await File.find_one({"_id": PydanticObjectId(file_id)})

    if file and file.type == "application/pdf":
        loader = PyPDFLoader(file.storage_url)
        data = await loader.aload()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=150
        )

        docs = text_splitter.split_documents(data)

        return docs
