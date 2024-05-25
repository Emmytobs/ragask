"""Configuration settings for the server"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """These settings are loaded from .env"""

    frontend_url: str
    mongodb_uri: str
    google_client_id: str
    google_client_secret: str


settings = Settings()
