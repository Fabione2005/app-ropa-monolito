import axios from 'axios';

const codespaceName = process.env.CODESPACE_NAME;
const codespaceBaseURL = codespaceName
  ? `https://${codespaceName}-8080.app.github.dev`
  : null;

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ??
  codespaceBaseURL ??
  'http://localhost:8080';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
