import { FC, ReactNode } from 'react';

interface TitleLabelProps {
  children: ReactNode;
  className?: string;
  level?: 'h3' | 'h4';
}

export const TitleLabel: FC<TitleLabelProps> = ({ children, className = '', level = 'h3' }) => {
  const Tag = level;
  return <Tag className={`text-lg font-semibold mb-2 ${className}`}>{children}</Tag>;
};
