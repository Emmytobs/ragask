from langchain_openai import OpenAIEmbeddings

from config import ENV_VARS


EMBEDDINGS_MODEL = OpenAIEmbeddings(
    api_key=ENV_VARS.openai_api_key, disallowed_special=()
)
