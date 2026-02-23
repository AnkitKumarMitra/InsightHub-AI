import apiClient from "./axios";

/**
 * Login user and return JWT
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} access_token
 */
export async function loginUser(email, password) {

  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return response.data.access_token;
}