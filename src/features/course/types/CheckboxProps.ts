export interface CheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  description?: string; 
  onChange: (value: boolean) => void;
}