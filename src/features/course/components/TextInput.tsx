// ./components/TextInput.tsx (or wherever it's located)
import React from 'react';
import { TextInputProps } from '../types/TextInputProps'; // Adjust the import path as necessary
// Explicitly define the props interface here (or export from '../types/TextInputProps')
// I've added 'placeholder' to match your usage in AddCoursePage.
// Made it optional (?) since it's not always needed.
// Kept 'required' as optional with default true, per your original code.


const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  value,
  onChange,
  required = true,  // Default to true, per your original
  placeholder,      // New prop
  ...rest           // Spread for any additional props (e.g., className, disabled)
}) => (
  <div>
    <label htmlFor={id} className="block font-medium">
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded"
      required={required}        // Fix: Pass the prop to input (was missing!)
      placeholder={placeholder}  // New: Pass the prop to input
      {...rest}                  // Allow extra props (e.g., for styling or validation)
    />
  </div>
);

export default TextInput;
