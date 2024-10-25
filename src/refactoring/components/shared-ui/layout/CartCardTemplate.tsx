import { FC, ReactNode } from 'react';
import { TitleLabel } from '../atoms';
type CartCardTemplateProps = {
  title?: string;
  children: ReactNode;
};

export const CartCardTemplate: FC<CartCardTemplateProps> = ({ title, children }) => {
  return (
    <div className="mt-4 mb-4 bg-white p-4 rounded shadow">
      {title && (
        <TitleLabel level="h2" size="xxl" weight="semibold" margin="small">
          {title}
        </TitleLabel>
      )}
      {children}
    </div>
  );
};
