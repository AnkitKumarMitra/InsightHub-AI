from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.security import get_current_user
from app.services.rag_service import RAGService
from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store_singleton import vector_store
from app.infrastructure.groq_client import GroqClient

from app.core.constants import FAISS_INDEX_PATH

router = APIRouter()

embedder = EmbeddingService()

llm_client = GroqClient()

rag_service = RAGService(
    embedder=embedder,
    vector_store=vector_store,
    llm_client=llm_client,
)

class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str


@router.post("/", response_model=QueryResponse)
def query_knowledge_base(
    request: QueryRequest,
    current_user: dict = Depends(get_current_user),
):

    answer = rag_service.answer_question(request.question)

    return QueryResponse(answer=answer)