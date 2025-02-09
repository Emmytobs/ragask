from typing import List
from beanie import Document, PydanticObjectId
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

from src.embeddings import EMBEDDINGS_MODEL
from src.vectors.schemas import DocumentMetadata


def custom_jsonable_encoder(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, list):
        return [custom_jsonable_encoder(item) for item in obj]
    if isinstance(obj, dict):
        return {key: custom_jsonable_encoder(value) for key, value in obj.items()}
    return jsonable_encoder(obj)


class DocumentVectors(Document):
    document_id: PydanticObjectId
    embeddings: List[float]
    page_content: str
    metadata: DocumentMetadata

    class Settings:
        name = "document_vectors"

    @classmethod
    async def get_related_chunks(cls, query: str, document_id: str):

        query_embeddings = EMBEDDINGS_MODEL.embed_query(query)

        results = await cls.aggregate(
            aggregation_pipeline=[
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "embeddings",
                        "queryVector": query_embeddings,
                        "numCandidates": 2000,
                        "limit": 50,
                        "filter": {"document_id": ObjectId(document_id)},
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "document_id": 1,
                        "page_content": 1,
                        "metadata": 1,
                    }
                },
            ]
        ).to_list()
        return custom_jsonable_encoder(results)
