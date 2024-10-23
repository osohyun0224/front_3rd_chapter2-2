import { FC } from 'react';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export const Label: FC<LabelProps> = ({ htmlFor, children, className = "block mb-1" }) => {
  return <label htmlFor={htmlFor} className={className}>{children}</label>;
};
