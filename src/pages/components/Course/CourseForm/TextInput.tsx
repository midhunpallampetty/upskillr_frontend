import { TextInputProps } from "../types/TextInputProps";
  
  const TextInput: React.FC<TextInputProps> = ({ label, id, value, onChange, required = true }) => (
    <div>
      <label htmlFor={id} className="block font-medium">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required={required}
      />
    </div>
  );
  
  export default TextInput;
  