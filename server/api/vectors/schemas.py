from pydantic import BaseModel


class DocumentMetadata(BaseModel):
    source: str
    page: int


class QueryResult(BaseModel):
    page_content: str
    metadata: DocumentMetadata
