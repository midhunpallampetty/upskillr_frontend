// src/hooks/useRegisterReducer.ts
import { useReducer } from 'react';
import type { SchoolFormData } from '../types/SchoolForm';

type State = {
  imageFile: File | null;
  coverImageFile: File | null;
  fieldErrors: Partial<SchoolFormData>;
  message: string;
  loading: boolean;
  isLoading: boolean;
};

type Action =
  | { type: 'SET_IMAGE_FILE'; payload: File | null }
  | { type: 'SET_COVER_IMAGE_FILE'; payload: File | null }
  | { type: 'SET_FIELD_ERRORS'; payload: Partial<SchoolFormData> }
  | { type: 'CLEAR_FIELD_ERROR'; field: keyof SchoolFormData }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const initialState: State = {
  imageFile: null,
  coverImageFile: null,
  fieldErrors: {},
  message: '',
  loading: false,
  isLoading: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_IMAGE_FILE':
      return { ...state, imageFile: action.payload };
    case 'SET_COVER_IMAGE_FILE':
      return { ...state, coverImageFile: action.payload };
    case 'SET_FIELD_ERRORS':
      return { ...state, fieldErrors: action.payload };
    case 'CLEAR_FIELD_ERROR':
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.field]: '' },
      };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const useRegisterReducer = () => useReducer(reducer, initialState);
