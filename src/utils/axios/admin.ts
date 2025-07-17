import axios from 'axios';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
  withCredentials: true,
});

export default adminAxios;
