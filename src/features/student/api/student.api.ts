import { RegisterData } from '../types/RegisterData';
import { StudentLoginData, StudentLoginResponse } from '../types/StudentData';
import studentAxios from '../../../utils/axios/student';
import { apiRequest } from '../../../utils/apiRequest';
import schoolAxios from '../../../utils/axios/school';

// Register Student
export const registerStudent = async (
  formData: RegisterData & { schoolName: string }
) => {
  try {
    return await apiRequest<any>(studentAxios, 'post', '/register', formData);
  } catch (err: any) {
    const message = err.response?.data?.msg || 'Something went wrong during registration';
    throw new Error(message);
  }
};

// Login Student
export const loginStudent = async (
  formData: StudentLoginData & { schoolName: string }
): Promise<StudentLoginResponse> => {
  try {
    return await apiRequest<StudentLoginResponse>(studentAxios, 'post', '/login', formData);
  } catch (err: any) {
    throw err.response?.data || new Error('Login failed');
  }
};

// Verify OTP
export const verifyStudentOtp = async (email: string, otp: string, schoolName: string) => {
  return await apiRequest<any>(studentAxios, 'post', '/verify-otp', { email, otp, schoolName });
};

// Send Reset Link
export const sendStudentResetLink = async (email: string, schoolName: string): Promise<string> => {
  const res = await apiRequest<{ message: string }>(
    studentAxios,
    'post',
    '/forgot-password',
    { email, schoolName }
  );
  return res.message || 'Reset link sent to your email.';
};

// Reset Password
export const resetStudentPassword = async (
  email: string,
  token: string,
  newPassword: string,
  schoolName: string
): Promise<string> => {
  const res = await apiRequest<{ message: string }>(
    studentAxios,
    'post',
    '/reset-password',
    { email, token, newPassword, schoolName }
  );
  return res.message || 'Password reset successfully.';
};

// Get Student by ID
export const getStudentById = async (id: string, schoolName: string) => {
  const res = await apiRequest<{ student: any }>(
    studentAxios,
    'get',
    `/student/${id}`,
    null,
    { params: { schoolName } }
  );
  return res.student;
};

// Update Student
export const updateStudentById = async (id: string, payload: any, schoolName: string) => {
  return await apiRequest<any>(studentAxios, 'put', `/students/${id}`, {
    ...payload,
    schoolName,
  });
};


export const getAllSchools = async (filters: {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
} = {}): Promise<{
  schools: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  count: number;
  msg: string;
}> => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);

    // ✅ Only fetch verified schools
    params.append('isVerified', 'true');

    const res = await apiRequest<any>(
      schoolAxios,
      'get',
      `/getSchools?${params.toString()}`
    );

    return {
      schools: Array.isArray(res.schools) ? res.schools : [],
      total: res.total || 0,
      totalPages: res.totalPages || 1,
      currentPage: res.currentPage || 1,
      count: res.count || 0,
      msg: res.msg || 'Success',
    };
  } catch (err) {
    console.error('❌ Error fetching schools:', err);
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
