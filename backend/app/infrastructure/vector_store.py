from typing import List, Tuple
import os
import pickle

import faiss
import numpy as np


class FAISSVectorStore:

    def __init__(self, embedding_dim: int, index_path: str = "faiss.index"):
        self.embedding_dim = embedding_dim
        self.index_path = index_path

        self.index = faiss.IndexFlatIP(embedding_dim)

        self.metadata: List[dict] = []

        if os.path.exists(self.index_path):
            self._load()

    def add_embeddings(
        self,
        embeddings: List[List[float]],
        metadatas: List[dict],
    ) -> None:
        if len(embeddings) != len(metadatas):
            raise ValueError("Embeddings and metadata length mismatch")

        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.metadata.extend(metadatas)

        self._save()

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
    ) -> List[Tuple[dict, float]]:
        query_vector = np.array([query_embedding]).astype("float32")

        scores, indices = self.index.search(query_vector, top_k)

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue
            results.append((self.metadata[idx], float(score)))

        return results

    def _save(self) -> None:
        faiss.write_index(self.index, self.index_path)
        with open(self._meta_path(), "wb") as f:
            pickle.dump(self.metadata, f)

    def _load(self) -> None:
        self.index = faiss.read_index(self.index_path)
        with open(self._meta_path(), "rb") as f:
            self.metadata = pickle.load(f)

    def _meta_path(self) -> str:
        return f"{self.index_path}.meta"