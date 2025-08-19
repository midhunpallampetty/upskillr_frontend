// ./components/Checkbox.tsx (or wherever it's located)
import React from 'react';
import { CheckboxProps } from '../types/CheckboxProps'; // Adjust the import path as necessary
// Explicitly define the props interface here (or export from '../types/CheckboxProps')
// Added 'description' to match your usage in AddCoursePage.
// Made it optional (?) since it's not always needed.


const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  checked,
  onChange,
  description,  // New prop
  ...rest       // Spread for any additional props (e.g., className, disabled)
}) => {
  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
        {...rest}  // Allow extra props (e.g., for styling or accessibility)
      />
      <div className="flex flex-col">
        <label htmlFor={id} className="cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
