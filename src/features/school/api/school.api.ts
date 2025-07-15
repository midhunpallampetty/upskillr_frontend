import axios from 'axios';
import type { School } from '../../course/types/School';

const BASE_URL = 'http://school.localhost:5000/api';

export const getSchools = async (
  search: string = '',
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  page: number = 1,
  limit: number = 6
): Promise<{ schools: School[]; total: number; totalPages: number }> => {
  const res = await axios.get(`${BASE_URL}/getSchools`, {
    params: { search, sortBy, sortOrder, page, limit },
  });
  return res.data;
};

export const approveSchool = async (schoolId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/updateSchoolData`, {
    _id: schoolId,
    isVerified: true,
  });
};
export const getSchoolBySubdomain = async (subDomain: string) => {
  const url = `${BASE_URL}/getSchoolBySubDomain?subDomain=http://${subDomain}.localhost:5173`;
  return axios.get(url);
};  

export const createDatabase = async (schoolName: string) => {
  return axios.post(`${BASE_URL}/create-database`, { schoolName });
};
