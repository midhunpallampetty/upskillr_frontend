// types/Section.ts (assuming this file exists; adjust as needed)
export default interface Section {
  title: string;
  sectionName: string;
  description: string;
  examRequired: boolean;
  _id: string;
  videos: any[]; // Replace 'any' with a more specific type if available (e.g., Video[])
}

// types/CourseFormState.ts
// types/CourseFormState.ts (update this file)
export interface CourseFormState {
  courseName: string;
  isPreliminary: boolean;
  courseThumbnail: File | null;
  previewURL: string | null;
  fee: number | '';
  sections: Section[];
  isLoading: boolean;
  errors: {
    courseName: string;
    fee: string;
    sections: string;
    thumbnail: string;
  };
}

