import { FC } from 'react';
import { ItemListTemplate } from '../templates';
import { Coupon } from '../../../types';
import { CouponItem } from '../atoms';
import { TitleLabel } from '../atoms';

type CouponListProps = {
  coupons: Coupon[];
};

export const CouponList: FC<CouponListProps> = ({ coupons }) => {
  return (
    <ItemListTemplate>
      <TitleLabel level={'h3'}>현재 쿠폰 목록</TitleLabel>
      {coupons.map((coupon, index) => (
        <CouponItem
          key={index}
          testId={`coupon-${index + 1}`}
          content={`${coupon.name} (${coupon.code}):${coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인`}
        />
      ))}
    </ItemListTemplate>
  );
};
