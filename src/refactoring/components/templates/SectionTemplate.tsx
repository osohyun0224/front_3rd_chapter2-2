import { FC, ReactNode } from 'react';

type SectionTemplateProps = {
  title: string;
  children: ReactNode;
};

export const SectionTemplate: FC<SectionTemplateProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
