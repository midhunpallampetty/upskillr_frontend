import React from 'react';
import { CheckboxProps } from '../types/CheckboxProps';
const Checkbox: React.FC<CheckboxProps> = ({ label, id, checked, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <label htmlFor={id} className="cursor-pointer">{label}</label>
    </div>
  );
};

export default Checkbox;
