// src/api/school.ts
import axios from 'axios';

const API_BASE = import.meta.env.SCHOOL_API_BASE;

export const registerSchool = async (formData: any) => {
  const response = await axios.post(`${API_BASE}/register`, formData);
  return response.data;
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
