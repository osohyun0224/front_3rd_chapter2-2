import { FC } from 'react';
import { Button } from '../common-ui/atoms';
import { DiscountItem } from '../common-ui/atoms';
import { Product } from '../../../types';

type ProductDetailProps = {
  product: Product;
  onClickEditProduct: (product: Product) => void;
};

export const ProductDetail: FC<ProductDetailProps> = ({ product, onClickEditProduct }) => {
  return (
    <div>
      <DiscountItem discounts={product.discounts} />

      <Button
        data-testid="modify-button"
        size="small"
        text="수정"
        onClick={() => onClickEditProduct(product)}
      />
    </div>
  );
};
