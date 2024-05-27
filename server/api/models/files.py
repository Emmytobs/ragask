"""Module for defining the File document schema with Beanie."""

from datetime import datetime
from pydantic import BaseModel
from beanie import Document, PydanticObjectId


class File(Document):
    """
    Represents a file
    """

    name: str
    is_indexed: bool
    storage_id: str
    storage_url: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    num_pages: int
    uploaded_by: PydanticObjectId
    type: str
    size: int

    class Settings:
        name = "files"
        validate_on_save = True


class CreateFile(BaseModel):
    name: str
    is_indexed: bool = False
    storage_id: str
    storage_url: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    num_pages: int = 0
    uploaded_by: PydanticObjectId | None = None
    type: str
    size: int
