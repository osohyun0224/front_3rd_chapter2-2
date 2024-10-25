import { FC } from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  className?: string;
};

export const Select: FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  className = 'w-full p-2 border rounded',
}) => {
  return (
    <select name={name} value={value} onChange={onChange} className={className}>
      <option value="">쿠폰 선택</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
