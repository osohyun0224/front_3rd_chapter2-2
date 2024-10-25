import { FC, ReactNode } from 'react';
import { TitleLabel } from '../atoms';
type SectionTemplateProps = {
  title: string;
  children: ReactNode;
};

export const SectionTemplate: FC<SectionTemplateProps> = ({ title, children }) => {
  return (
    <div>
      <TitleLabel level="h2" size="xxl" weight="semibold" margin="medium">
        {title}
      </TitleLabel>

      {children}
    </div>
  );
};
