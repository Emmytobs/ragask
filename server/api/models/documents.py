"""Module for defining the File document schema with Beanie."""

from datetime import datetime
from pydantic import BaseModel
from beanie import Document as BeanieDocument, PydanticObjectId


class Document(BeanieDocument):
    """
    Represents a document
    """

    name: str
    is_indexed: bool
    storage_id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    num_pages: int
    uploaded_by: PydanticObjectId
    type: str
    size: int

    class Settings:
        name = "documents"
        validate_on_save = True


class CreateDocument(BaseModel):
    name: str
    is_indexed: bool = False
    storage_id: str
    num_pages: int = 0
    uploaded_by: PydanticObjectId | None = None
    type: str
    size: int