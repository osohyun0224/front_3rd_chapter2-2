import { FC } from 'react';

interface InputFieldProps {
  id?: string;
  name?: string;
  placeholder?: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

export const InputField: FC<InputFieldProps> = ({
  id,
  name,
  placeholder,
  type,
  value,
  onChange,
  label,
  className = 'w-full p-2 border rounded'
}) => {
  const inputProps = {
    id,
    name,
    placeholder,
    type,
    value,
    onChange
  };

  return (
    <>
      {label && <label htmlFor={id} className="block mb-1">{label}</label>}
      <input {...inputProps} className={className} />
    </>
  );
};
