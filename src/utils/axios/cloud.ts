import axios from 'axios';

const cloudAxios = axios.create({
  baseURL: import.meta.env.VITE_CLOUD_BASE,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default cloudAxios;
