export interface CheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}