import type { School } from '../../course/types/School';
import schoolAxios from '../../../utils/axios/school';

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
export const getSchoolBySubdomain = async (subDomain: string) => {
  const url = `/getSchoolBySubDomain?subDomain=http://${subDomain}.localhost:5173`;
  return schoolAxios.get(url);
};  

export const createDatabase = async (schoolName: string) => {
  return schoolAxios.post(`/create-database`, { schoolName });
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

