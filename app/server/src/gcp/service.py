"""Module for interacting with Google Cloud Storage."""

from google.cloud import storage
from src.config import ENV_VARS


def get_storage_bucket():
    """
    Retrieves the storage bucket using the configured project and bucket name.

    Returns:
        bucket: The retrieved Google Cloud Storage bucket instance.
    """
    storage_client = storage.Client(project=ENV_VARS.google_bucket_project_id)
    bucket = storage_client.get_bucket(ENV_VARS.google_bucket_name)
    return bucket
