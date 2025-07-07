// src/api/school.ts
import axios from 'axios';

const API_BASE = "http://school.localhost:5000/api";

export const registerSchool = async (formData: any) => {
  const response = await axios.post(`${API_BASE}/register`, formData);
  return response.data;
};
// src/api/school.ts


export const loginSchool = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data.school; // return only school for cleaner use
};

export const uploadToCloudinary = async (file: File, cloudName: string, uploadPreset: string) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    data
  );
  return response.data.secure_url;
};
