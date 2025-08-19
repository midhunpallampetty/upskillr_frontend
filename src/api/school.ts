import schoolAxios from '../utils/axios/school';
import cloudAxios from '../utils/axios/cloud';


export const registerSchool = async (formData: any) => {
  const response = await schoolAxios.post(`/register`, formData);
  return response.data;
};
// src/api/school.ts


export const loginSchool = async (email: string, password: string) => {
  const res = await schoolAxios.post(
    `/login`,
    { email, password },
    {
      withCredentials: true, // ✅ include cookies in request and allow browser to accept Set-Cookie
    }
  );
  return res.data;
};


export const uploadToCloudinary = async (file: File, cloudName: string, uploadPreset: string) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);

  const response = await cloudAxios.post(
    `/${cloudName}/image/upload`,
    data
  );
  return response.data.secure_url;
};
