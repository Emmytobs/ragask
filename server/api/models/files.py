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
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    num_pages: int = None
    uploaded_by: PydanticObjectId
    type: str
    size: int

    class Settings:
        name = "files"
