import axios from 'axios';

const courseAxios = axios.create({
  baseURL: "http://course.localhost:5000/api",
  withCredentials: true,
});

export default courseAxios;
