from typing import List

from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store import FAISSVectorStore
from app.infrastructure.groq_client import GroqClient


class RAGService:

    def __init__(
        self,
        embedder: EmbeddingService,
        vector_store: FAISSVectorStore,
        llm_client: GroqClient,
        top_k: int = 5,
    ):
        
        self.embedder = embedder
        self.vector_store = vector_store
        self.llm_client = llm_client
        self.top_k = top_k


    def answer_question(self, question: str) -> str:

        query_embedding = self.embedder.embed_text(question)

        retrieved = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=self.top_k,
        )

        context_chunks = [meta["text"] for meta, _score in retrieved]

        prompt = self._build_prompt(question, context_chunks)

        answer = self.llm_client.generate(prompt)

        return answer


    def _build_prompt(self, question: str, context_chunks: List[str]) -> str:

        if context_chunks:
            context = "\n\n".join(context_chunks)
        else:
            context = "No relevant context found."
            
        prompt = f"""
        You are a knowledgeable assistant. Answer the question using ONLY the context below.
        If the context does not contain the answer, say you do not know.

        Context:
        {context}

        Question:
        {question}

        Answer:
        """.strip()

        return prompt