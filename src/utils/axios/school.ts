// schoolAxios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const schoolAxios = axios.create({
  baseURL: import.meta.env.VITE_SCHOOL_API_BASE,
  withCredentials: false,
});

// 💡 Automatically add token to every request
schoolAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken'); // or from cookies/sessionStorage/etc.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default schoolAxios;
