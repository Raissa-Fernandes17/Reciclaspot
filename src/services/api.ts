import axios from 'axios';
import { Platform } from 'react-native';

const TIMEOUT_MS = 8000;

const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.137.144.230:3000';

export const api = axios.create({
  baseURL: API_URL,
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
