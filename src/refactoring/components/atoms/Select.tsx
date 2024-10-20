import React from 'react';

interface SelectProps {
  options: { value: string, label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
