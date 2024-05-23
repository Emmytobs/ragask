"""Module for initializing the FastAPI application and including routers."""

from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager


from api.database import init_db
from api.routes.files import router as FileRouter
from api.routes.users import router as UserRouter


from dotenv import load_dotenv

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize the database and manage the lifespan of the app context.
    """
    await init_db()

    yield


app = FastAPI(lifespan=lifespan)


app.include_router(FileRouter, tags=["File"], prefix="/files")
app.include_router(UserRouter, tags=["User"], prefix="/users")
