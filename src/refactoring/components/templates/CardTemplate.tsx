import { FC, ReactNode } from 'react';

type CardTemplateProps = {
  title?: string;
  children: ReactNode;
};

export const CardTemplate: FC<CardTemplateProps> = ({ title, children }) => {
  return (
    <div className="mt-4 mb-4 bg-white p-4 rounded shadow">
      {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
};
