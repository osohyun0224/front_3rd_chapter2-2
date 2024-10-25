import { FC } from 'react';

type InputProps = {
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export const Input: FC<InputProps> = ({
  id,
  name,
  placeholder,
  type,
  value,
  onChange,
  size = 'medium',
  className = '',
}) => {
  const inputValue = type === 'number' ? value.toString() : value;

  const sizeClass = {
    small: 'w-1/3 p-2 border rounded',
    medium: 'w-full p-2 border rounded',
    large: 'w-full p-4 border rounded',
  };

  const finalClassName = `${sizeClass[size]} ${className}`.trim();

  return (
    <input
      id={id}
      name={name}
      placeholder={placeholder}
      type={type}
      value={inputValue}
      onChange={onChange}
      className={finalClassName}
    />
  );
};
