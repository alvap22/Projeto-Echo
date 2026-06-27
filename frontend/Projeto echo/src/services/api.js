import axios from "axios";

const NGROK_URL = "https://imagines-catfish-sandstorm.ngrok-free.dev";

// 1. Configura cabeçalho padrão global para ignorar aviso do ngrok em qualquer chamada
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

// 2. Interceptor de requisição global para direcionar chamadas de localhost para o Ngrok
axios.interceptors.request.use(
  (config) => {
    if (config.url) {
      if (config.url.startsWith("http://localhost:3000")) {
        config.url = config.url.replace("http://localhost:3000", NGROK_URL);
      } else if (!config.url.startsWith("http")) {
        // Para requisições relativas se houverem
        config.url = `${NGROK_URL}${config.url.startsWith("/") ? "" : "/"}${config.url}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de resposta global para reescrever URLs de uploads locais (localhost:3000/uploads)
// vindas do banco de dados, convertendo-as para usar o domínio do Ngrok.
axios.interceptors.response.use(
  (response) => {
    const rewriteUrls = (obj) => {
      if (!obj) return obj;
      if (typeof obj === "string") {
        if (obj.startsWith("http://localhost:3000/uploads/")) {
          return obj.replace("http://localhost:3000", NGROK_URL);
        }
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(rewriteUrls);
      }
      if (typeof obj === "object") {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = rewriteUrls(obj[key]);
          }
        }
      }
      return obj;
    };
    response.data = rewriteUrls(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Instância centralizada e configurada exportada como padrão
// O header `ngrok-skip-browser-warning` é obrigatório quando o backend
// está exposto via Ngrok free tier — sem ele, o Ngrok retorna uma página
// HTML de aviso ao invés do JSON esperado, causando erros de CORS/Network.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || NGROK_URL,
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
