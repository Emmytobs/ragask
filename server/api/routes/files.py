"""Module for handling file-related routes in the API."""

from fastapi import APIRouter, Request
from api.models.files import CreateFile, File
from pydantic import BaseModel

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


# @router.post('/embedded')
# async def extract_embeddings(file: File) -> dict:
