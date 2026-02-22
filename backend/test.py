from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store import FAISSVectorStore

embedder = EmbeddingService()
store = FAISSVectorStore(384)

store.add_embeddings(
    embeddings=[embedder.embed_text("RAG combines retrieval with generation.")],
    metadatas=[{"text": "RAG combines retrieval with generation."}]
)