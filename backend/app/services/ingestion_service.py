from pathlib import Path
from typing import Optional

from app.infrastructure.embeddings import EmbeddingService
from app.infrastructure.vector_store import FAISSVectorStore
from app.utils.chunking import chunk_text
from app.services.file_parsers import extract_text


class IngestionService:

    def __init__(
        self,
        embedder: EmbeddingService,
        vector_store: FAISSVectorStore,
    ):
        self.embedder = embedder
        self.vector_store = vector_store

    def ingest_text(
        self,
        text: str,
        source: str,
    ) -> int:
        chunks = chunk_text(text)

        embeddings = self.embedder.embed_texts(chunks)

        metadatas = [
            {
                "text": chunk,
                "source": source,
                "chunk_id": idx,
            }
            for idx, chunk in enumerate(chunks)
        ]

        self.vector_store.add_embeddings(
            embeddings=embeddings,
            metadatas=metadatas,
        )

        return len(chunks)

    def ingest_file(self, file_path: Path) -> int:
        """
        Ingest a file (txt, pdf, docx).
        """

        text: Optional[str] = extract_text(file_path)

        if not text:
            raise ValueError("Unsupported or empty file")

        return self.ingest_text(
            text=text,
            source=file_path.name,
        )