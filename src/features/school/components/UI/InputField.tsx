// components/ui/InputField.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, icon, placeholder, type = 'text', value, onChange, isDarkMode }) => {
  return (
    <div className="space-y-2">
      <label className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-300 ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <span className={`transition-colors duration-300 ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {icon}
        </span>
        <span>{label}</span>
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
            isDarkMode 
              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
          }`}
        />
        {value && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
    </div>
  );
};

export default InputField;