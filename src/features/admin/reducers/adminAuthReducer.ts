import { AdminAuthState } from '../types/AdminAuthState';

export type AdminAuthAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'TOGGLE_LOGIN' }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'RESET_CONFIRM_PASSWORD' };

export const initialAdminAuthState: AdminAuthState = {
  email: '',
  password: '',
  confirmPassword: '',
  isLogin: false,
  message: '',
};

export const adminAuthReducer = (
  state: AdminAuthState,
  action: AdminAuthAction
): AdminAuthState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'TOGGLE_LOGIN':
      return {
        ...state,
        isLogin: !state.isLogin,
        message: '',
        confirmPassword: '',
      };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'RESET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: '' };
    default:
      return state;
  }
};
