"""Module for initializing the database connection and setting up Beanie with FastAPI."""

from api.models import files, users
from api.config import settings

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient


async def init_db():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(database=client.ragask, document_models=[files.File, users.User])
