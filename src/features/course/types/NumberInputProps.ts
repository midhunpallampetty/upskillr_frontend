export interface NumberInputProps {
  label: string;
  id: string;
  value: number | '';
  onChange: (val: number | '') => void;
  min?: number;
  placeholder?: string;
  required?: boolean;
}


