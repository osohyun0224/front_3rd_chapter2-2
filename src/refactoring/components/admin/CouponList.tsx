import { FC } from 'react';
import { ItemListTemplate } from '../common-ui/layout';
import { Coupon } from '../../../types';
import { CouponItem } from '../common-ui/atoms';
import { TitleLabel } from '../common-ui/atoms';

type CouponListProps = {
  coupons: Coupon[];
};

export const CouponList: FC<CouponListProps> = ({ coupons }) => {
  return (
    <ItemListTemplate>
      <TitleLabel level="h3" size="lg" weight="semibold" margin="small">현재 쿠폰 목록</TitleLabel>
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
