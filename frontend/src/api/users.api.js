import apiClient from "./axios";

/**
 * Register a new user (internal tool)
 */
export async function registerUser({ name, email, password }) {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
}