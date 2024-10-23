import { FC } from 'react';
import { Label, Input } from "../atoms"

interface InputFieldProps {
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name?: string;
  placeholder?: string;
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
  className
}) => {
  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} name={name} placeholder={placeholder} type={type} value={value} onChange={onChange} className={className} />
    </>
  );
};
