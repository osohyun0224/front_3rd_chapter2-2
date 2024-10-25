import { FC } from 'react';
import { TitleLabel } from '../atoms';
type PageTemplateProps = {
  title: string;
  children: React.ReactNode;
};
export const PageTemplate: FC<PageTemplateProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto p-4">
      <TitleLabel level="h1" size="xxxl" weight="bold" margin="large">
        {title}
      </TitleLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};
