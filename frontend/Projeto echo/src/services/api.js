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
const api = axios.create({
  baseURL: NGROK_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
