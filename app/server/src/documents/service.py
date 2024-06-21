from io import BytesIO
from beanie import PydanticObjectId
from fastapi import HTTPException, status

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from pypdf import PdfReader

from src.app_logging import logger
from src.embeddings import EMBEDDINGS_MODEL
from src.documents.models import Document
from src.documents.schemas import CreateDocument
from src.users.models import User
from src.vectors.models import DocumentVectors
from src.gcp.service import get_storage_bucket


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


async def extract_embeddings(
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


async def existing_document(document: CreateDocument, user: User) -> Document | None:
    # Find any saved documents that match the name, size and type of the document being uploaded
    existing_document = await Document.find_one({"name": document.name, "size": document.size, "type": document.type, "uploaded_by": user.id}) 
    return existing_document

async def upload_pdf_document(document: CreateDocument, user: User) -> Document:
    document = Document(**document.model_dump())

    if document.type != "application/pdf":
        raise HTTPException(status_code=400, detail="only supports PDF uploads")

    document.uploaded_by = user.id
    document.is_indexed = False

    document.num_pages = _get_num_pages_from_pdf(document)

    result = await Document.insert_one(document)

    return result


async def add_document_to_last_accessed_documents(user_id: str, document_id: str):
    user = await User.find_one(User.id == user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist"
        )
    last_accessed_pdfs = user.last_accessed_pdfs + [PydanticObjectId(document_id)]
    result = await User.find_one(User.id == user_id).update(
        {"$set": {"last_accessed_pdfs": last_accessed_pdfs}}
    )
    logger.info("Last accessed pdfs: %s", result)
    logger.info("Result from marking document as last accessed: %s", result)


async def _user_has_access_to_document(document_id: str, user_id: str):
    document = await Document.find_one(
        {"uploaded_by": PydanticObjectId(user_id), "_id": PydanticObjectId(document_id)}
    )
    if not document:
        return False

    return True
