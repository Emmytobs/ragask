from typing import List
from beanie import Document, PydanticObjectId
from pydantic import BaseModel


class DocumentMetadata(BaseModel):
    source: str
    page: int


class DocumentVectors(Document):
    document_id: PydanticObjectId
    embedding: List[float]
    page_content: str
    metadata: DocumentMetadata
