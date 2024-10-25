import { FC, ReactNode } from 'react';
import { TitleLabel } from "../atoms";
type CardTemplateProps = {
  title?: string;
  children: ReactNode;
};

export const CardTemplate: FC<CardTemplateProps> = ({ title, children, }) => {
  return (
    <div className="mt-4 mb-4 bg-white p-4 rounded shadow">
      {title && <TitleLabel level="h3" size="xl" weight="semibold" margin="small">{title}</TitleLabel>
      }
      {children}
    </div>
  );
};
