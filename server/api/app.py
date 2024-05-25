"""Module for initializing the FastAPI application and including routers."""

import uuid

from api.config import settings
from api.database import init_db
from api.routes import files, users, login

from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize the database and manage the lifespan of the app context.
    """
    await init_db()

    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=uuid.uuid4().hex)


origins = [settings.frontend_url]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(login.router, tags=["Login"], prefix="")
app.include_router(files.router, tags=["File"], prefix="/files")
app.include_router(users.router, tags=["User"], prefix="/users")
