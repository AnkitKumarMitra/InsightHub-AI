import apiClient from "./axios";

/**
 * Ask a question to the RAG backend
 * @param {string} question
 * @returns {Promise<string>}
 */
export async function askQuestion(question) {
  const response = await apiClient.post("/query", {
    question,
  });

  return response.data.answer;
}