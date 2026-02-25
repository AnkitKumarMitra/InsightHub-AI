from typing import List, Tuple
import os
import pickle
import numpy as np


class FAISSVectorStore:
    def __init__(
        self,
        embedding_dim: int,
        index_path: str = "faiss.index",
    ):
        self.embedding_dim = embedding_dim
        self.index_path = index_path
        self.meta_path = f"{self.index_path}.meta"

        self.index = None
        self.metadata: List[dict] = []

        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            try:
                self._load()
                if self.index.d != self.embedding_dim:
                    self._reset_index()
            except Exception:
                self._reset_index()

    def _reset_index(self):
        import faiss

        self.index = faiss.IndexFlatIP(self.embedding_dim)
        self.metadata = []

        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.meta_path):
            os.remove(self.meta_path)

    def _ensure_index(self):
        if self.index is None:
            import faiss
            self.index = faiss.IndexFlatIP(self.embedding_dim)

    def _normalize(self, vectors: np.ndarray) -> None:
        import faiss
        faiss.normalize_L2(vectors)

    def _save(self) -> None:
        import faiss
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)

        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)

    def _load(self) -> None:
        import faiss

        self.index = faiss.read_index(self.index_path)
        with open(self.meta_path, "rb") as f:
            self.metadata = pickle.load(f)

    def add_embeddings(
        self,
        embeddings: List[List[float]],
        metadatas: List[dict],
    ) -> None:
        if len(embeddings) != len(metadatas):
            raise ValueError("Embeddings and metadata length mismatch")

        self._ensure_index()

        vectors = np.array(embeddings, dtype="float32")

        # 🛡 Dimension safety check
        if vectors.shape[1] != self.embedding_dim:
            raise ValueError(
                f"Embedding dimension mismatch: "
                f"expected {self.embedding_dim}, got {vectors.shape[1]}"
            )

        self._normalize(vectors)
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

        query_vector = np.array([query_embedding], dtype="float32")

        if query_vector.shape[1] != self.embedding_dim:
            raise ValueError(
                f"Query embedding dimension mismatch: "
                f"expected {self.embedding_dim}, got {query_vector.shape[1]}"
            )

        self._normalize(query_vector)

        scores, indices = self.index.search(query_vector, top_k)

        results: List[Tuple[dict, float]] = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue
            results.append((self.metadata[idx], float(score)))

        return results