import { FC } from 'react';
import { Coupon } from '../../../types';

interface CouponItemProps {
  coupon: Coupon;
  index: number;
}

export const CouponItem: FC<CouponItemProps> = ({ coupon, index }) => {
  return (
    <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
    </div>
  );
};
