import { StudentLoginData } from '../types/StudentData';

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export const validateStudentLogin = (formData: StudentLoginData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!formData.password.trim()) {
    errors.password = 'Password is required';
  }

  return errors;
};
