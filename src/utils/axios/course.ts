import axios from 'axios';

const courseAxios = axios.create({
  baseURL: import.meta.env.VITE_COURSE_API_BASE,
  withCredentials: false,
});

export default courseAxios;
