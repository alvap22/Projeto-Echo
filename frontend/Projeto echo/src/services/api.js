import axios from "axios";

/**
 * Instância central do Axios para o backend.
 *
 * O header `ngrok-skip-browser-warning` é obrigatório quando o backend
 * está exposto via Ngrok free tier — sem ele, o Ngrok retorna uma página
 * HTML de aviso ao invés do JSON esperado, causando erros de CORS/Network.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Interceptor: injeta o token JWT automaticamente em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
