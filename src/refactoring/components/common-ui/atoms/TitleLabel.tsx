import { FC, ReactNode } from 'react';

type TitleLabelProps = {
  children: ReactNode;
  className?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'lg' | 'xl' | 'xxl' | 'xxxl';
  weight?: 'normal' | 'bold' | 'semibold';
  margin?: 'none' | 'small' | 'medium' | 'large';
};

const sizeClasses = {
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
  xxxl: 'text-3xl',
};

const weightClasses = {
  normal: 'font-normal',
  bold: 'font-bold',
  semibold: 'font-semibold',
};

const marginClasses = {
  none: '',
  small: 'mb-2',
  medium: 'mb-4',
  large: 'mb-6',
};

export const TitleLabel: FC<TitleLabelProps> = ({
  children,
  className = '',
  level = 'h2',
  size = 'xl',
  weight = 'semibold',
  margin = 'none',
}) => {
  const Tag = level;
  const sizeClass = sizeClasses[size];
  const weightClass = weightClasses[weight];
  const marginClass = marginClasses[margin];

  return (
    <Tag className={`${sizeClass} ${weightClass} ${marginClass} ${className}`}>{children}</Tag>
  );
};
