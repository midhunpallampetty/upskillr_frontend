import axios from 'axios';

const studentAxios = axios.create({
  baseURL: import.meta.env.VITE_STUDENT_API_BASE,
  withCredentials: false,
});

export default studentAxios;
