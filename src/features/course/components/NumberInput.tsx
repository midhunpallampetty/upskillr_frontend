import React from 'react';
import { NumberInputProps } from '../types/NumberInputProps';


const NumberInput: React.FC<NumberInputProps> = ({
  label,
  id,
  value,
  onChange,
  min = 0,
  placeholder,
  required,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val === '' ? '' : Number(val));
  };

  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        min={min}
        placeholder={placeholder}
        required={required}
        {...rest}
      />
    </div>
  );
};

export default NumberInput;
