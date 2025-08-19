export interface TextInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
    placeholder?: string; 
  }