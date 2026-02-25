from pathlib import Path
from app.infrastructure.vector_store import FAISSVectorStore

BASE_DIR = Path(__file__).resolve().parents[2]

FAISS_INDEX_PATH = BASE_DIR / "faiss.index"

vector_store = FAISSVectorStore(
    embedding_dim=768,
    index_path=str(FAISS_INDEX_PATH),
)