export interface Props {
  schoolId: string;
  dbname: string;
}
export interface SectionProps {
  sectionId: string;
  schoolDb: string;
}
export interface VideoUploadProgress {
  progress: number;
  stage: 'preparing' | 'uploading' | 'processing' | 'complete'| 'error';
  message: string;
}