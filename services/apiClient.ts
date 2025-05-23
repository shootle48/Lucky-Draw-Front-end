import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export default apiClient;