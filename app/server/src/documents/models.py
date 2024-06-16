"""Module for defining the File document schema with Beanie."""

from datetime import datetime
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
