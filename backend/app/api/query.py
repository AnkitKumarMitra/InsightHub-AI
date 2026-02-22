from fastapi import APIRouter, Depends
from pydantic import BaseModel
from functools import lru_cache

from app.core.security import get_current_user
from app.services.rag_service import RAGService
from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store_singleton import vector_store
from app.infrastructure.groq_client import GroqClient

router = APIRouter()

class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str


@lru_cache(maxsize=1)
def get_embedder() -> EmbeddingService:
    return EmbeddingService()


@lru_cache(maxsize=1)
def get_llm_client() -> GroqClient:
    return GroqClient()


@lru_cache(maxsize=1)
def get_rag_service() -> RAGService:
    return RAGService(
        embedder=get_embedder(),
        vector_store=vector_store,
        llm_client=get_llm_client(),
    )

@router.post("/", response_model=QueryResponse)
def query_knowledge_base(
    request: QueryRequest,
    current_user: dict = Depends(get_current_user),
):
    rag_service = get_rag_service()

    answer = rag_service.answer_question(request.question)

    return QueryResponse(answer=answer)