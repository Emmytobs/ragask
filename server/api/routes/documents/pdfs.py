"""Module for handling PDF document operations."""

import asyncio
from io import BytesIO
from beanie import PydanticObjectId
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from starlette.responses import StreamingResponse
from langchain_openai import ChatOpenAI

from app_logging import logger
from config import ENV_VARS
from embeddings import EMBEDDINGS_MODEL
from models.document_vectors import DocumentVectors
from models.documents import CreateDocument, Document
from models.users import User
from cloud import get_storage_bucket

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.messages import HumanMessage, SystemMessage


from pypdf import PdfReader


router = APIRouter()


def _get_num_pages_from_pdf(document: Document) -> int:
    try:
        bucket = get_storage_bucket()

        blob = bucket.blob(document.name)
        blob_content = blob.download_as_bytes()

        reader = PdfReader(BytesIO(blob_content))
        return len(reader.pages)
    except Exception as e:
        logger.error(str(e))
        return 0


def _get_pdf_url(document: Document):
    bucket = get_storage_bucket()
    blob = bucket.blob(document.name)
    # TODO: make this safe. Unable to use the signed url because PyPDFLoader says the url is too long
    blob.make_public()
    return blob.public_url


async def _get_pdf_content(url: str):
    loader = PyPDFLoader(url)
    data = await loader.aload()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)

    docs = text_splitter.split_documents(data)
    return docs


async def _process_text_to_embeddings(document: Document):
    url = _get_pdf_url(document)
    docs = await _get_pdf_content(url)
    embeddings = EMBEDDINGS_MODEL.embed_documents([doc.page_content for doc in docs])
    document_vectors = [
        DocumentVectors(
            document_id=document.id,
            embeddings=embeddings[i],
            page_content=docs[i].page_content,
            metadata={
                "page": docs[i].metadata["page"],
                "source": docs[i].metadata["source"],
            },
        )
        for i in range(len(docs))
    ]
    return document_vectors


async def _mark_document_as_indexed(document_id: str):
    result = await Document.find_one(Document.id == document_id).update(
        {"$set": {Document.is_indexed: True}}
    )
    logger.info("Result from marking document as indexed: %s", result)


async def _extract_embeddings(
    document_id: PydanticObjectId,
):
    document = await Document.find_one({"_id": document_id})

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pdf Document not found"
        )

    if document.is_indexed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pdf Document is already indexed",
        )

    if not document.type == "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Document is not a PDF"
        )

    document_vectors = await _process_text_to_embeddings(document)

    result = await DocumentVectors.insert_many(document_vectors)

    if result.acknowledged:
        await _mark_document_as_indexed(document.id)

    return {
        "acknowledged": result.acknowledged,
        "inserted_count": len(result.inserted_ids),
    }


async def _upload_pdf_document(document: CreateDocument, user: User):

    document = Document(**document.model_dump())

    if document.type != "application/pdf":
        raise HTTPException(status_code=400, detail="only supports PDF uploads")

    document.uploaded_by = user.id
    document.is_indexed = False

    document.num_pages = _get_num_pages_from_pdf(document)

    result = await Document.insert_one(document)

    return result


@router.post("/upload", response_description="Upload file")
async def process_pdf_document(
    document: CreateDocument, request: Request, background_tasks: BackgroundTasks
):
    logger.info("Uploading document")
    uploaded_document = await _upload_pdf_document(document, request.state.user)

    logger.info("Extracting embeddings")
    background_tasks.add_task(_extract_embeddings, uploaded_document.id)
    return {"message": "success", "document_id": str(uploaded_document.id)}


async def _user_has_access_to_document(document_id: str, user_id: str):
    document = await Document.find_one(
        {"uploaded_by": PydanticObjectId(user_id), "_id": PydanticObjectId(document_id)}
    )
    if not document:
        return False

    return True


@router.get("/chat/{document_id}")
async def chat_with_document(document_id: str, query: str, request: Request):
    logger.info("Chatting with document")
    user_has_access = await _user_has_access_to_document(
        document_id, request.state.user.id
    )
    if not user_has_access:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not have access to this document",
        )

    docs = await DocumentVectors.get_related_chunks(query, document_id)

    context = "\n\n".join([doc["page_content"] for doc in docs])

    chat = ChatOpenAI(model="gpt-3.5-turbo-0125", api_key=ENV_VARS.openai_api_key)

    messages = [
        SystemMessage(
            content=f"You're a helpful assistant. \
             Given the content of this document answer the human question.\
            Make sure all your answers are in markdown: Context: {context}. Return only the markdown. For new lines add \n"
        ),
        HumanMessage(content=query),
    ]

    def generate_response():
        try:
            for chat_chunk in chat.stream(messages):
                yield f"data: {chat_chunk.content}\n\n"
        except asyncio.CancelledError as e:
            logger.error("Llm stream cancelled %s", request.client)
            raise e

    logger.info("Related documents: %s", docs)
    return StreamingResponse(generate_response(), media_type="text/event-stream")
