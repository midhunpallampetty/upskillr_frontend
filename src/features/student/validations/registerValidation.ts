import {RegisterData,RegisterFormErrors} from "../types/RegisterData";

export const validateStudentRegister = (formData: RegisterData): RegisterFormErrors => {
  const newErrors:any = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = 'Full name is required';
  } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
    newErrors.fullName = 'Full name must contain only letters and spaces';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email address';
  }

  if (!formData.password.trim()) {
    newErrors.password = 'Password is required';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(formData.password)
  ) {
    newErrors.password =
      'Password must be at least 6 characters and include uppercase, lowercase, number, and special character';
  }

  return newErrors;
};
