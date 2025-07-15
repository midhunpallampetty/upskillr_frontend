import axios from 'axios';
import {RegisterData} from '../types/RegisterData';
import { StudentLoginData, StudentLoginResponse } from '../types/StudentData';
import { School } from '../types/School';
const BASE_URL = import.meta.env.VITE_STUDENT_API_BASE;
const SCHOOL_BASE_URL=import.meta.env.VITE_SCHOOL_API_BASE ;
export const registerStudent = async (formData: RegisterData) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, formData);
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
    const res = await axios.post(
      `${import.meta.env.VITE_STUDENT_API_BASE}/login`,
      formData
    );
    return res.data;
  } catch (err: any) {
    throw err.response?.data || new Error('Login failed');
  }
};

export const getAllSchools = async (): Promise<School[]> => {
  try {
    const res = await axios.get(`${SCHOOL_BASE_URL}/getSchools`);

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