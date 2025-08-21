import {RegisterData} from '../types/RegisterData';
import { StudentLoginData, StudentLoginResponse } from '../types/StudentData';
import { School } from '../types/School';
import schoolAxios from '../../../utils/axios/school';
import studentAxios from '../../../utils/axios/student';
  export const registerStudent = async (formData: RegisterData) => {
    try {
      const res = await studentAxios.post(`/register`, formData);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.msg || 'Something went wrong during registration';
      throw new Error(message);
    }
  };
export const loginStudent = async (
  formData: StudentLoginData
): Promise<StudentLoginResponse> => {
  try {
    const res = await studentAxios.post(
      `/login`,
      formData
    );
    return res.data;
  } catch (err: any) {
    throw err.response?.data || new Error('Login failed');
  }
};


// student.api.ts
export const verifyStudentOtp = (email: string, otp: string) =>
  studentAxios.post('/verify-otp', { email, otp });

export const sendStudentResetLink = async (email: string): Promise<string> => {
  const response = await studentAxios.post(`/forgot-password`, { email });
  return response.data.message || 'Reset link sent to your email.';
};
export const resetStudentPassword = async (email: string, token: string, newPassword: string): Promise<string> => {
  const response = await studentAxios .post(`/reset-password`, {
    email,
    token,
    newPassword,
  });
  return response.data.message || 'Password reset successfully.';
};
export const getStudentById = async (id: string) => {
  const response = await studentAxios.get(`/student/${id}`);
  return response.data.student;
};

export const updateStudentById = async (id: string, payload: any) => {
  return await studentAxios.put(`/students/${id}`, payload);
};



import { AxiosResponse } from 'axios'; // Import if not already (for type safety)

// Assuming schoolAxios is your configured Axios instance
export const getAllSchools = async (filters: {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  fromDate?: string; // ISO date string, e.g., '2025-01-01'
  toDate?: string;   // ISO date string, e.g., '2025-12-31'
} = {}): Promise<{
  schools: any[]; // Replace 'any' with your School type if defined
  total: number;
  totalPages: number;
  currentPage: number;
  count: number;
  msg: string;
}> => {
  try {
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);

    // ✅ Force only verified schools
    params.append('isVerified', 'true');

    const res: AxiosResponse = await schoolAxios.get(`/getSchools?${params.toString()}`);

    // Extract and return the structured response data
    const data = res.data;
    return {
      schools: Array.isArray(data.schools) ? data.schools : [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      count: data.count || 0,
      msg: data.msg || 'Success',
    };
  } catch (err) {
    console.error('❌ Error fetching schools:', err);
    // Return a default structure on error
    return {
      schools: [],
      total: 0,
      totalPages: 1,
      currentPage: 1,
      count: 0,
      msg: 'Error fetching schools',
    };
  }
};

