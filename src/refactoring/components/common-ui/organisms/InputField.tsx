import { FC } from 'react';
import { Label, Input } from '../atoms';

type InputFieldProps = {
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const InputField: FC<InputFieldProps> = ({
  id,
  name,
  placeholder,
  type,
  value,
  size,
  onChange,
  label,
  className,
}) => {
  return (
    <>
      <div className="mb-2">
        {label && (
          <Label htmlFor={id} size={'small'} color={'info'}>
            {label}
          </Label>
        )}
        <Input
          id={id}
          name={name}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          size={size}
          className={className}
        />
      </div>
    </>
  );
};
