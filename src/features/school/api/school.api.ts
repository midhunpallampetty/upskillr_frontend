// frontend/src/features/school/api/school.api.ts
import type { School } from '../../course/types/School';
import schoolAxios from '../../../utils/axios/school';
import axios from 'axios';
import cloudAxios from '../../../utils/axios/cloud';

export const getSchools = async (
  search: string = '',
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  page: number = 1,
  limit: number = 6,
  verified?: boolean, // Optional: true for verified, false for unverified, undefined for all
  fromDate?: string, // Optional ISO string for start of range
  toDate?: string // Optional ISO string for end of range
): Promise<{ schools: School[]; total: number; totalPages: number }> => {
  const params: any = { search, sortBy, sortOrder, page, limit };

  // Conditionally add isVerified param as string ('true' or 'false')
  if (verified !== undefined) {
    params.isVerified = verified ? 'true' : 'false';
  }

  // Conditionally add date range params
  if (fromDate) {
    params.fromDate = fromDate;
  }
  if (toDate) {
    params.toDate = toDate;
  }

  const res = await schoolAxios.get(`/getSchools`, { params });

  // Extract and return only the needed fields to match the return type
  return {
    schools: res.data.schools,
    total: res.data.total,
    totalPages: res.data.totalPages,
  };
};



export const approveSchool = async (schoolId: string): Promise<void> => {
  await schoolAxios.post(`/updateSchoolData`, {
    _id: schoolId,
    isVerified: true,
  });
};
export const getSchoolBySubdomain = async (subDomain: string, token: string) => {
  const url = `/getSchoolBySubDomain?subDomain=https://${subDomain}.eduvia.space`;
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
  const response = await schoolAxios.get(`/getSchoolBySubDomain?subDomain=${encodeURIComponent(subDomain)}`);
  return response.data;
};

export const updateSchoolData = async (payload: any) => {
  return await schoolAxios.post('/updateSchoolData', payload);
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

  const response = await cloudAxios.post(
    `/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
};

