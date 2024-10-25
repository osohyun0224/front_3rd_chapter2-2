import { FC } from 'react';

type DiscountItemProps = {
  discounts: { quantity: number; rate: number }[];
};

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
