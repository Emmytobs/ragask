"""Module for initializing the database connection and setting up Beanie with FastAPI."""

from models import documents, users, document_vectors
from config import ENV_VARS

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(ENV_VARS.mongodb_uri)
db = client.ragask


async def init_db():
    await init_beanie(
        database=db,
        document_models=[
            documents.Document,
            users.User,
            document_vectors.DocumentVectors,
        ],
    )
