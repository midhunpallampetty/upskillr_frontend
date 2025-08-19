import axios from 'axios';

const axiosInterceptor = axios.create({
  baseURL: import.meta.env.VITE_MAIN_API,
  withCredentials: true,
});

export default axiosInterceptor;
