import type { School } from '../../course/types/School';
import schoolAxios from '../../../utils/axios/school';
import axios from 'axios';

export const getSchools = async (
  search: string = '',
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  page: number = 1,
  limit: number = 6
): Promise<{ schools: School[]; total: number; totalPages: number }> => {
  const res = await schoolAxios.get(`/getSchools`, {
    params: { search, sortBy, sortOrder, page, limit },
  });
  return res.data;
};

export const approveSchool = async (schoolId: string): Promise<void> => {
  await schoolAxios.post(`/updateSchoolData`, {
    _id: schoolId,
    isVerified: true,
  });
};
export const getSchoolBySubdomain = async (subDomain: string, token: string) => {
  const url = `/getSchoolBySubDomain?subDomain=http://${subDomain}.localhost:5173`;
console.log(token)
  return schoolAxios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createDatabase = async (schoolName: string, token: string) => {
  return schoolAxios.post(
    `/create-database`,
    { schoolName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const sendForgotPasswordLink = async (email: string) => {
  const response = await schoolAxios.post('/forgot-password', {
    email,
  });
  return response.data;
};

export const resetSchoolPassword = async ({
  token,
password,
}: {
  token: string;
  password: string;
}) => {
  const response = await schoolAxios.post('/reset-password', {
    token,
    password,
  });
  return response.data;
};
export const getSchoolByDomain = async (subDomain: string) => {
  const response = await axios.get(`http://school.localhost:5000/api/getSchoolBySubDomain?subDomain=${encodeURIComponent(subDomain)}`);
  return response.data;
};

export const updateSchoolData = async (payload: any) => {
  return await axios.post('http://school.localhost:5000/api/updateSchoolData', payload);
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
};

