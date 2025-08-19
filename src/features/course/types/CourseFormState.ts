import Section from "../types/Section";
export type CourseFormState = {
  courseName: string;
  isPreliminary: boolean;
  courseThumbnail: File | null;
  previewURL: string | null;
  fee: number | '';
  sections: Section[];
  isLoading: boolean;
};