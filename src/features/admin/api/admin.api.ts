import adminAxios from '../../../utils/axios/admin';
import { AuthResponse } from '../types/AuthResponse';


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
