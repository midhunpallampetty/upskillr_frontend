export interface AddExamToSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string; // dbname from props
  sectionId: string;
  onSuccess: () => void; // Callback to refresh sections after update
}