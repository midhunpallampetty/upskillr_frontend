// reducers/courseForm.reducer.ts (update this file)
import Section from "../types/Section";
import { CourseFormState } from "../types/CourseFormState";

export type CourseFormAction =
  | { type: 'SET_COURSE_NAME'; payload: string }
  | { type: 'SET_IS_PRELIMINARY'; payload: boolean }
  | { type: 'SET_THUMBNAIL'; payload: File | null }
  | { type: 'SET_PREVIEW_URL'; payload: string | null }
  | { type: 'SET_FEE'; payload: number | '' }
  | { type: 'SET_SECTIONS'; payload: Section[] | ((prev: Section[]) => Section[]) }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Partial<CourseFormState['errors']> }
  | { type: 'RESET_FORM' };

export const initialCourseFormState: CourseFormState = {
  courseName: '',
  isPreliminary: false,
  courseThumbnail: null,
  previewURL: null,
  fee: '',
  sections: [
    {
      title: '',
      sectionName: '',
      description: '',
      examRequired: false,
      _id: '',
      videos: [],
    },
  ],
  isLoading: false,
  errors: {
    courseName: '',
    fee: '',
    sections: '',
    thumbnail: '',
  },
};

export function courseFormReducer(
  state: CourseFormState,
  action: CourseFormAction
): CourseFormState {
  switch (action.type) {
    case 'SET_COURSE_NAME':
      return { ...state, courseName: action.payload };
    case 'SET_IS_PRELIMINARY':
      return { ...state, isPreliminary: action.payload };
    case 'SET_THUMBNAIL':
      return { ...state, courseThumbnail: action.payload };
    case 'SET_PREVIEW_URL':
      return { ...state, previewURL: action.payload };
    case 'SET_FEE':
      return { ...state, fee: action.payload };
    case 'SET_SECTIONS':
      const updatedSections =
        typeof action.payload === 'function'
          ? action.payload(state.sections)
          : action.payload;
      return { ...state, sections: updatedSections };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case 'RESET_FORM':
      return initialCourseFormState;
    default:
      return state;
  }
}
