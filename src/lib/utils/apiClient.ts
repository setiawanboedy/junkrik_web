import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // agar cookie HttpOnly otomatis dikirim
});

export default api;
