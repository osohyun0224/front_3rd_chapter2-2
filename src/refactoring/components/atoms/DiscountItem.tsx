import { FC } from 'react';

interface DiscountItemProps {
  discounts: { quantity: number; rate: number }[];
}
//UI만
export const DiscountItem: FC<DiscountItemProps> = ({ discounts }) => {
  return (
    <>
      {discounts.map((discount, index) => (
        <div key={index} className="mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
        </div>
      ))}
    </>
  );
};
