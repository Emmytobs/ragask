"""Module for initializing the database connection and setting up Beanie with FastAPI."""

from config import ENV_VARS

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from documents.models import Document
from users.models import User
from vectors.models import DocumentVectors

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
