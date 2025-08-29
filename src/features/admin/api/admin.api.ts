import { apiRequest } from '../../../utils/apiRequest';   // <-- import common apiRequest
import adminAxios from '../../../utils/axios/admin';
import { AuthResponse } from '../types/AuthResponse';

// Register Admin
export const registerAdmin = (email: string, password: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(
    adminAxios,
    'post',
    '/register',
    { email, password },
    { withCredentials: false }
  );
};

// Login Admin
export const loginAdmin = (email: string, password: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(
    adminAxios,
    'post',
    '/login',
    { email, password },
    { withCredentials: false }
  );
};
