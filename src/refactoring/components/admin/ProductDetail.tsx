import { FC } from 'react';
import { Button } from '../atoms';
import { DiscountList } from './DiscountList';
import { Product } from '../../../types';

type ProductDetailProps = {
  product: Product;
  onClickEditProduct: (product: Product) => void;
}

export const  ProductDetail: FC<ProductDetailProps > = ({ product, onClickEditProduct }) => {
  return (
    <div>
      <DiscountList discounts={product.discounts} />

      <Button data-testid="modify-button" size="small" text="수정" onClick={() => onClickEditProduct(product)} />
    </div>
  );
};
