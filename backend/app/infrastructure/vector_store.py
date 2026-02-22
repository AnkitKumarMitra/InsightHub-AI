from typing import List, Tuple
import os
import pickle
import numpy as np


class FAISSVectorStore:
    def __init__(self, embedding_dim: int, index_path: str = "faiss.index"):
        self.embedding_dim = embedding_dim
        self.index_path = index_path

        self.index = None
        self.metadata: List[dict] = []

        if os.path.exists(self.index_path):
            self._load()


    def _ensure_index(self):
        if self.index is None:
            import faiss
            self.index = faiss.IndexFlatIP(self.embedding_dim)

    def _meta_path(self) -> str:
        return f"{self.index_path}.meta"

    def _save(self) -> None:
        import faiss

        faiss.write_index(self.index, self.index_path)
        with open(self._meta_path(), "wb") as f:
            pickle.dump(self.metadata, f)

    def _load(self) -> None:
        import faiss

        self.index = faiss.read_index(self.index_path)
        with open(self._meta_path(), "rb") as f:
            self.metadata = pickle.load(f)


    def add_embeddings(
        self,
        embeddings: List[List[float]],
        metadatas: List[dict],
    ) -> None:
        if len(embeddings) != len(metadatas):
            raise ValueError("Embeddings and metadata length mismatch")

        self._ensure_index()

        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.metadata.extend(metadatas)

        self._save()

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
    ) -> List[Tuple[dict, float]]:
        if self.index is None or self.index.ntotal == 0:
            return []

        query_vector = np.array([query_embedding]).astype("float32")
        scores, indices = self.index.search(query_vector, top_k)

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue
            results.append((self.metadata[idx], float(score)))

        return results