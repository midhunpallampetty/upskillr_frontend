// frontend/src/features/school/api/school.api.ts
import type { School } from '../../course/types/School';
import schoolAxios from '../../../utils/axios/school';
import cloudAxios from '../../../utils/axios/cloud';
import { apiRequest } from '../../../utils/apiRequest';

type GetSchoolsResponse = {
  schools: School[];
  total: number;
  totalPages: number;
};

export const getSchools = async (
  search = '',
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  page = 1,
  limit = 6,
  verified?: boolean,
  fromDate?: string,
  toDate?: string
): Promise<GetSchoolsResponse> => {
  const params: any = { search, sortBy, sortOrder, page, limit };
  if (verified !== undefined) params.isVerified = verified ? 'true' : 'false';
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  return apiRequest<GetSchoolsResponse>(schoolAxios, 'get', '/getSchools', null, { params });
};

export const approveSchool = async (schoolId: string): Promise<void> => {
  await apiRequest<void>(schoolAxios, 'post', '/updateSchoolData', { _id: schoolId, isVerified: true });
};



export const createDatabase = async (schoolName: string, token: string) => {
  return apiRequest<any>(
    schoolAxios,
    'post',
    '/create-database',
    { schoolName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const sendForgotPasswordLink = async (email: string) => {
  return apiRequest<any>(schoolAxios, 'post', '/forgot-password', { email });
};

export const resetSchoolPassword = async ({ token, password }: { token: string; password: string }) => {
  return apiRequest<any>(schoolAxios, 'post', '/reset-password', { token, password });
};

export const getSchoolByDomain = async (subDomain: string) => {
  const url = `/getSchoolBySubDomain?subDomain=${encodeURIComponent(subDomain)}`;
  return apiRequest<any>(schoolAxios, 'get', url);
};

export const updateSchoolData = async (payload: any) => {
  return apiRequest<any>(schoolAxios, 'post', '/updateSchoolData', payload);
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

  const response = await apiRequest<any>(
    cloudAxios,
    'post',
    `/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.secure_url;
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
export const setSchoolBlockStatus = async (schoolId: string, isBlocked: boolean): Promise<void> => {
  await apiRequest<void>(schoolAxios, 'put', `/schools/${schoolId}/block-status`, { isBlocked });
};

export const registerSchool = async (formData: any) => {
  return apiRequest<any>(schoolAxios, 'post', '/register', formData);
};

export const loginSchool = async (email: string, password: string) => {
  return apiRequest<any>(
    schoolAxios,
    'post',
    '/login',
    { email, password },
    { withCredentials: true }
  );
};

export const uploadToCloudinaryData = async (file: File, cloudName: string, uploadPreset: string) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);

  const response = await apiRequest<any>(cloudAxios, 'post', `/${cloudName}/image/upload`, data);
  return response.secure_url;
};
