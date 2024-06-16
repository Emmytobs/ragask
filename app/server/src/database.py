"""Module for initializing the database connection and setting up Beanie with FastAPI."""

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from src.config import ENV_VARS
from src.documents.models import Document
from src.users.models import User
from src.vectors.models import DocumentVectors


client = AsyncIOMotorClient(ENV_VARS.mongodb_uri)
db = client.ragask


async def init_db():
    await init_beanie(
        database=db,
        document_models=[
            Document,
            User,
            DocumentVectors,
        ],
    )
