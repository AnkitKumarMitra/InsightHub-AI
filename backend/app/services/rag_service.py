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
        try:
            query_embedding = self.embedder.embed_text(question)
        except Exception as e:
            print("Embedding error:", str(e))
            raise RuntimeError("Embedding service unavailable")

        try:
            retrieved = self.vector_store.search(
                query_embedding=query_embedding,
                top_k=self.top_k,
            )
        except Exception as e:
            print("Vector store error:", str(e))
            retrieved = []

        context_chunks = [
            meta.get("text", "")
            for meta, _score in retrieved
            if meta.get("text")
        ]

        prompt = self._build_prompt(question, context_chunks)

        try:
            answer = self.llm_client.generate(prompt)
        except Exception as e:
            print("LLM generation error:", str(e))
            raise RuntimeError("LLM service unavailable")

        return answer


    def _build_prompt(self, question: str, context_chunks: List[str]) -> str:
        if context_chunks:
            context = "\n\n".join(context_chunks)
        else:
            context = "No relevant context was found in the knowledge base."

        prompt = f"""
        You are a knowledgeable assistant.
        Answer the question using ONLY the information provided in the context.
        If the context does not contain the answer, say clearly that you do not know.
        Do NOT make up information.

        Context:
        {context}

        Question:
        {question}

        Answer:
        """.strip()

        return prompt