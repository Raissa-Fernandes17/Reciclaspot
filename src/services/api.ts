import axios from 'axios';

const TIMEOUT_MS = 8000;

export const api = axios.create({
  baseURL: 'http://192.168.1.X:3000',
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo limite excedido. Verifique sua rede.'));
    }
    return Promise.reject(error);
  }
);
