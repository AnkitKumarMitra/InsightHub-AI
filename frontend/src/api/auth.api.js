import apiClient from "./axios";

/**
 * Login user and return JWT
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} access_token
 */
export async function loginUser(email, password) {
  console.log("LOGIN REQUEST:", email, password);

  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  console.log("LOGIN RESPONSE:", response.data);

  return response.data.access_token;
}