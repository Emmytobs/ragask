"""Module for handling file-related routes in the API."""

from fastapi import APIRouter
from api.models.files import File


router = APIRouter()


@router.post("/upload", response_description="Review added to the database")
async def upload_file(file: File) -> File:
    print("Im here")
    result = await file.insert()
    return result