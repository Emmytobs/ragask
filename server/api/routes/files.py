"""Module for handling file-related routes in the API."""

from typing import List
from beanie import PydanticObjectId
from fastapi import APIRouter, Request
from api.models.files import CreateFile, File
from pydantic import BaseModel

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

router = APIRouter()


class Files(BaseModel):
    files: list[CreateFile]


def prepare_files_with_user_id(files: Files, request: Request) -> list:
    """Helper function to add user ID to files and prepare them for insertion."""
    files_with_user_id = []
    for file in files.files:
        file.uploaded_by = request.state.user.id
        files_with_user_id.append(File(**file.model_dump()))
    return files_with_user_id


@router.post("/upload", response_description="Upload files")
async def upload_file(files: Files, request: Request):
    files_with_user_id = prepare_files_with_user_id(files, request)

    result = await File.insert_many(files_with_user_id)

    str_inserted_ids = [str(inserted_id) for inserted_id in result.inserted_ids]

    return {
        "acknowledge": result.acknowledged,
        "inserted_ids": str_inserted_ids,
    }


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
