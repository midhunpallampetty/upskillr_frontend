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

export const getAllSchools = async (): Promise<School[]> => {
  try {
    const res = await schoolAxios.get(`/getSchools`);

    const schoolList = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data.schools)
      ? res.data.schools
      : Array.isArray(res.data.data)
      ? res.data.data
      : [];

    return schoolList;
  } catch (err) {
    console.error('❌ Error fetching schools:', err);
    return []; 
  }
};

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