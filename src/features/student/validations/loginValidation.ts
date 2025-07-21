import { StudentLoginData } from '../types/StudentData';

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export const validateStudentLogin = (formData: StudentLoginData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Enter a valid email address';
  }

  // Password validation
  if (!formData.password.trim()) {
    errors.password = 'Password is required';
  } else {
    // Check for minimum length of 8 characters
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    // Check for at least 1 uppercase letter
    else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    }
    // Check for at least 1 lowercase letter
    else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    }
    // Check for at least 1 number
    else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }
    // Check for at least 1 special character
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = 'Password must contain at least one special character';
    }
  }

  return errors;
};