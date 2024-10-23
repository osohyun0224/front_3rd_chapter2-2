import { FC } from 'react';

interface InputProps {
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name?: string;
  placeholder?: string;
  className?: string;
}

export const Input: FC<InputProps> = ({ id, name, placeholder, type, value, onChange, className = 'w-full p-2 border rounded' }) => {
  const inputValue = type === 'number' ? value.toString() : value;
  return <input id={id} name={name} placeholder={placeholder} type={type} value={inputValue} onChange={onChange} className={className} />;
};
