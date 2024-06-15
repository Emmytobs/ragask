"""
This module defines the schemas for PDF document handling.
"""

from beanie import PydanticObjectId
from pydantic import BaseModel


class CreateDocument(BaseModel):
    name: str
    is_indexed: bool = False
    storage_id: str
    num_pages: int = 0
    uploaded_by: PydanticObjectId | None = None
    type: str
    size: int
