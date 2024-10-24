import { FC } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  className?: string;
}

export const Select: FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  className = 'w-full p-2 border rounded'
}) => {
  return (
    <select name={name} value={value} onChange={onChange} className={className}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
