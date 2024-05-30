"""Module for initializing the database connection and setting up Beanie with FastAPI."""

from models import files, users
from config import ENV_VARS

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient


async def init_db():
    client = AsyncIOMotorClient(ENV_VARS.mongodb_uri)
    await init_beanie(database=client.ragask, document_models=[files.File, users.User])
