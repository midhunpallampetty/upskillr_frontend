// src/api/admin.api.ts
import adminAxios from '../../../utils/axios/admin';

interface AuthResponse {
  accessToken:string;
  refreshToken:string;
  msg: string;
  admin?: any;
}

export const registerAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await adminAxios.post('/register', { email, password }, { withCredentials: false } );
  return response.data;
};

export const loginAdmin = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await adminAxios.post(
    '/login',
    { email, password },
    { withCredentials: false } 
  );
  return response.data;
};
