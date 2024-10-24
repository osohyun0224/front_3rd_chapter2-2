import { FC } from 'react';
import { Button } from '../atoms';
import { DiscountItem } from '../atoms'
import { Product } from '../../../types';

type ProductDetailProps = {
  product: Product;
  onClickEditProduct: (product: Product) => void;
}

export const  ProductDetail: FC<ProductDetailProps > = ({ product, onClickEditProduct }) => {
  return (
    <div>
      <DiscountItem discounts={product.discounts} />

      <Button data-testid="modify-button" size="small" text="수정" onClick={() => onClickEditProduct(product)} />
    </div>
  );
};
