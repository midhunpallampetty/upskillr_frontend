// src/hooks/useFormReducer.ts
import { useReducer } from 'react';
import type { SchoolFormData } from '../types/SchoolForm';

const initialFormState: SchoolFormData = {
  schoolName: '',
  experience: '',
  address: '',
  officialContact: '',
  city: '',
  state: '',
  country: '',
  image: '',
  coverImage: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof SchoolFormData; value: string }
  | { type: 'RESET_FORM' }
  | { type: 'SET_FORM'; payload: SchoolFormData };

const formReducer = (state: SchoolFormData, action: FormAction): SchoolFormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialFormState;
    case 'SET_FORM':
      return { ...action.payload };
    default:
      return state;
  }
};

export const useFormReducer = () => useReducer(formReducer, initialFormState);
