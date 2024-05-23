"""Module for defining the File document schema with Beanie."""

from datetime import datetime

from beanie import Document, PydanticObjectId


class File(Document):
    """
    Represents a file
    """

    name: str
    isIndexed: bool
    storageId: str
    created_at: datetime
    updated_at: datetime
    num_pages: int
    uploaded_by: PydanticObjectId
    file_type: str

    class Settings:
        name = "files"
