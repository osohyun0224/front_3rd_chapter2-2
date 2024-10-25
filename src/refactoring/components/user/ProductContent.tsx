import { FC } from 'react';
import { getMaxDiscount } from '../../hooks/utils';
import { Product } from '../../../types';
import { Button } from '../shared-ui/atoms';

type ProductContentProps = {
  product: Product;
  getRemainingStock: (id: string, stock: number) => number;
  onClickAddToCart: (product: Product) => void;
};

export const ProductContent: FC<ProductContentProps> = ({
  product,
  getRemainingStock,
  onClickAddToCart,
}) => {
  const { id, stock, name, price, discounts } = product;
  const remainingStock = getRemainingStock(id, stock);

  return (
    <div key={id} data-testid={`product-${id}`} className="bg-white p-3 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{name}</span>
        <span className="text-gray-600">{price.toLocaleString()}원</span>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        <span className={`font-medium ${remainingStock ? 'text-green-600' : 'text-red-600'}`}>
          재고: {remainingStock}개
        </span>

        {discounts.length && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>

      {discounts.length && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {discounts?.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
            </li>
          ))}
        </ul>
      )}

      <Button
        color={remainingStock ? 'primary' : 'disabled'}
        size="xlarge"
        text={remainingStock ? '장바구니에 추가' : '품절'}
        onClick={() => onClickAddToCart(product)}
        disabled={!remainingStock}
      />
    </div>
  );
};
