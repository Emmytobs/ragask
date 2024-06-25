"""Module for handling PDF document operations."""

import asyncio
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Request, status
from starlette.responses import StreamingResponse
from langchain_openai import ChatOpenAI


from langchain.schema.messages import HumanMessage, SystemMessage
from langsmith import traceable

from src.app_logging import logger
from src.config import ENV_VARS
from src.documents.models import Document
from src.documents.schemas import CreateDocument
from src.documents.service import (
    _user_has_access_to_document,
    add_document_to_last_accessed_documents,
    extract_embeddings,
    upload_pdf_document,
    existing_document,
)
from src.users.models import User
from src.vectors.models import DocumentVectors


router = APIRouter()


@router.get("/", response_description="Get all documents")
async def get_all_documents(request: Request):
    documents = await Document.find(
        Document.uploaded_by == PydanticObjectId(request.state.user.id)
    ).to_list()
    return {"documents": [doc.model_dump() for doc in documents]}


@router.patch(
    "/last-accessed",
    response_description="Update signed-in user's last accessed documents",
)
async def remove_document_from_last_accessed_documents(
    document_ids: list[str],
    request: Request
):
    user = await User.find_one(User.id == request.state.user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist"
        )
    last_accessed_pdfs = list(map(lambda document_id:PydanticObjectId(document_id), document_ids))
    result = await User.find_one(User.id == user.id).update(
        {"$set": {"last_accessed_pdfs": last_accessed_pdfs}}
    )
    logger.info("Last accessed pdfs: %s", result)
    return {"message": "success"}


@router.get("/last-accessed", response_description="Get last accessed documents")
async def get_last_accessed_documents(request: Request):
    user = await User.find_one(User.id == request.state.user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist"
        )
    documents_information = []
    for doc in user.last_accessed_pdfs:
        document = await Document.find_one({"_id": doc})
        documents_information.append(
            {
                "id": str(document.id),
                "name": document.name,
                "type": document.type,
                "num_pages": document.num_pages,
                "storage_id": document.storage_id,
            }
        )
    return {"last_accessed_docs": documents_information}


@router.post("/upload", response_description="Upload file")
async def process_pdf_document(documentDTO: CreateDocument, request: Request):
    document: Document
    document = await existing_document(documentDTO, request.state.user)
    user_has_existing_document = document is not None
    if user_has_existing_document:
        logger.info("Document exists for user")
    else:
        logger.info("Uploading document")
        document = await upload_pdf_document(documentDTO, request.state.user)

    if not document.is_indexed:
        logger.info("Extracting embeddings")
        result = await extract_embeddings(document.id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to extract embeddings",
            )

    await add_document_to_last_accessed_documents(request.state.user.id, document.id)
    return {"message": "success", "document_id": str(document.id)}


@router.get("/chat/{document_id}")
@traceable(name="chat_with_document")
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
    pages = [doc["metadata"]["page"] for doc in docs]

    chat = ChatOpenAI(model="gpt-3.5-turbo-0125", api_key=ENV_VARS.openai_api_key)

    messages = [
        SystemMessage(
            content=f"You are a helpful assistant. Given the content of this document, answer the human's question.\
                Ensure all your responses are formatted in markdown.\
                Always start your response with a markdown header and use proper markdown syntax for lists, code blocks, and other elements.\
                Make sure use line breaks to seperate paragraphs or points \
                Make sure the points you make are relevant to the question and the context of the document.\
                Context: {context}"
        ),
        HumanMessage(content=query),
    ]

    def generate_response():
        try:
            for chat_chunk in chat.stream(messages):
                yield f"data: {chat_chunk.content}\n\n"
            yield f"event: end\ndata: {f'{pages}'}\n\n"
        except asyncio.CancelledError as e:
            logger.error("Llm stream cancelled %s", request.client)
            raise e

    logger.info("Related documents: %s", docs)
    return StreamingResponse(generate_response(), media_type="text/event-stream")
