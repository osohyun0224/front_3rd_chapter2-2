import { FC, ReactNode } from 'react';

type ItemListProps = {
  children: ReactNode;
};
export const ItemListTemplate: FC<ItemListProps> = ({ children }: ItemListProps) => {
  return <div className="space-y-2">{children}</div>;
};
