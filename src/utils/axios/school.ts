import axios from 'axios';
import Cookies from 'js-cookie';

const schoolAxios = axios.create({
  baseURL: import.meta.env.VITE_SCHOOL_API_BASE,
  withCredentials: false,
});

// Request interceptor to prioritize token from request headers
schoolAxios.interceptors.request.use(
  (config) => {
    // Check if Authorization header is already set (e.g., from getSchoolBySubdomain)
    const token = config.headers?.Authorization || Cookies.get('accessToken') || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log baseURL for debugging (remove in production)
    console.log('Base URL:', import.meta.env.VITE_SCHOOL_API_BASE);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
schoolAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Token may be invalid or missing.');
    } else if (error.response?.status === 404) {
      console.error('Endpoint not found. Check URL or backend configuration.');
    } else if (error.response) {
      console.error(`API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error('Network error or backend unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);

export default schoolAxios;