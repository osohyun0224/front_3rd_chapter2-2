import { FC } from 'react';

type ButtonProps = {
  id?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'flex';
  color?: 'primary' | 'error' | 'info' | 'success' | 'disabled' | 'navigate' | 'add';
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

const colorStyles = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  info: 'bg-gray-300 text-black hover:bg-gray-400',
  error: 'bg-red-500 text-white hover:bg-red-600',
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  navigate: 'bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100',
  add: 'bg-blue-500 text-white p-2 rounded hover:bg-blue-600',
} as const;

const sizeStyles = {
  small: 'px-2 py-1',
  medium: 'px-4 py-2',
  large: 'px-6 py-3',
  xlarge: 'w-full px-3 py-1',
  flex: 'w-full',
} as const;

const computeButtonClassNames = (
  color: keyof typeof colorStyles,
  size: keyof typeof sizeStyles,
  additionalClasses: string
) => {
  const colorClass = colorStyles[color];
  const sizeClass = sizeStyles[size];
  return `rounded ${additionalClasses} ${colorClass} ${sizeClass}`.trim();
};

export const Button: FC<ButtonProps> = ({
  id,
  className = '',
  size = 'medium',
  color = 'primary',
  text = '새 상품 추가',
  onClick,
  disabled = false,
  ...props
}) => {
  const buttonClassNames = computeButtonClassNames(color, size, className);

  return (
    <button id={id} className={buttonClassNames} onClick={onClick} disabled={disabled} {...props}>
      {text}
    </button>
  );
};
