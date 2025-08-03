import axios from 'axios';

const examAxios = axios.create({
  baseURL: import.meta.env.VITE_EXAM_API_URL,
  withCredentials: false,
});

export default examAxios;
