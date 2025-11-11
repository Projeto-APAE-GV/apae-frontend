import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Se headers ainda não existir, inicializa como AxiosRequestHeaders
    if (!config.headers) {
      config.headers = {} as any; // ou 'as AxiosRequestHeaders' se quiser ser mais estrito
    }
    // Adiciona Authorization
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
