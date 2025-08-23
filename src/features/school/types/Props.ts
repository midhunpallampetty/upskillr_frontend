
export interface SectionProps {
  sectionId: string;
  schoolDb: string;
}
export interface VideoUploadProgress {
  progress: number;
  stage: 'preparing' | 'uploading' | 'processing' | 'complete'| 'error';
  message: string;
}

export interface Exam {
  _id: string;
  title: string;
  createdAt: string;
}

export interface Props {
  schoolId: string;
  dbname: string;
  schoolName: string;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // New: Callback to refresh parent after update
  currentPreliminaryExam: Exam | null; // Passed from parent
  currentFinalExam: Exam | null; // Passed from parent
}
