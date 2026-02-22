from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib import Path
import shutil
import uuid

from app.core.security import get_current_user
from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store_singleton import vector_store
from app.services.ingestion_service import IngestionService

from app.core.constants import FAISS_INDEX_PATH

router = APIRouter()

UPLOAD_DIR = Path("uploaded_docs")
UPLOAD_DIR.mkdir(exist_ok=True)

embedder = EmbeddingService()

ingestion_service = IngestionService(embedder, vector_store)


class IngestResponse(BaseModel):
    chunks_indexed: int
    filename: str


@router.post("/ingest/file", response_model=IngestResponse)
def ingest_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):

    suffix = Path(file.filename).suffix.lower()
    if suffix not in {".txt", ".pdf", ".docx"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    temp_name = f"{uuid.uuid4()}{suffix}"
    temp_path = UPLOAD_DIR / temp_name

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        chunks = ingestion_service.ingest_file(temp_path)
    finally:
        temp_path.unlink(missing_ok=True)

    return IngestResponse(
        chunks_indexed=chunks,
        filename=file.filename,
    )