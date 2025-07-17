import axios from 'axios';

const schoolAxios = axios.create({
  baseURL: import.meta.env.VITE_SCHOOL_API_BASE,
  withCredentials: false,
});

export default schoolAxios;
