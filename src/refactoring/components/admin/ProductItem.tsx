import { Product } from '../../../types';
import { FC, ReactNode } from 'react';
import { ItemListTemplate } from '../layout';
import { LabelButton } from '../atoms';

type ProductItemProps = {
  product: Product;
  index: number;
  toggleProducts: (id: string) => void;
  children: ReactNode;
};

export const ProductItem: FC<ProductItemProps> = ({ product, index, toggleProducts, children }) => {
  return (
    <ItemListTemplate>
      <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
        <LabelButton
          testId="toggle-button"
          onClick={() => toggleProducts(product.id)}
          label={`${product.name} - ${product.price}원 (재고: ${product.stock})`}
        />
        {children}
      </div>
    </ItemListTemplate>
  );
};
