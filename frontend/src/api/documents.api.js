import apiClient from "./axios";

export async function uploadDocuments(files, onProgress) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("file", files[i]);

    const response = await apiClient.post(
      "/documents/ingest/file",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!onProgress) return;
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );
          onProgress(i + 1, files.length, percent);
        },
      }
    );

    results.push(response.data);
  }

  return results;
}