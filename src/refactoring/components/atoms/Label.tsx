import { FC, ReactNode } from 'react';

type LabelProps = {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'flex';
  color?: 'primary' | 'error' | 'info' | 'success' | 'disabled' | 'navigate';
}

const sizeStyles = {
  small: 'text-sm',
  medium: 'text-md',
  large: 'text-lg',
  xlarge: 'text-xl',
  flex: 'text-flex',
} as const;

const colorStyles = {
  primary: 'text-blue-700',
  error: 'text-red-700',
  info: 'text-gray-600',
  success: 'text-green-700',
  disabled: 'text-gray-400',
  navigate: 'text-blue-600',
} as const;

export const Label: FC<LabelProps> = ({
  htmlFor,
  children,
  className = '',
  size = 'medium',
  color = 'info',
}) => {
  const sizeClass = sizeStyles[size];
  const colorClass = colorStyles[color];
  const finalClassName = `block mb-1 ${sizeClass} ${colorClass} ${className}`;

  return (
    <label htmlFor={htmlFor} className={finalClassName}>
      {children}
    </label>
  );
};
