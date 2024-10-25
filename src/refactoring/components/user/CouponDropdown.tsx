import { FC } from 'react';
import { Coupon } from '../../../types';
import { formatKrPrice, discountChangeFormat } from '../../hooks/utils';
import { Select, SelectOption } from '../common-ui/atoms/Select';

type CouponDropdownProps = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onChangeApplyCoupon: (coupon: Coupon) => void;
};

export const CouponDropdown: FC<CouponDropdownProps> = ({
  onChangeApplyCoupon,
  selectedCoupon,
  coupons,
}) => {
  const options: SelectOption[] = coupons.map((coupon, index) => ({
    value: index.toString(),
    label: `${coupon.name} - ${formatKrPrice(coupon.discountValue)}${discountChangeFormat(coupon)}`,
  }));

  const selectedValue = selectedCoupon ? coupons.indexOf(selectedCoupon).toString() : '';

  return (
    <>
      <Select
        name="coupon-select"
        value={selectedValue}
        onChange={(e) => onChangeApplyCoupon(coupons[parseInt(e.target.value)])}
        options={options}
        className="w-full p-2 border rounded mb-2"
      />
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name} ({formatKrPrice(selectedCoupon.discountValue)}
          {discountChangeFormat(selectedCoupon)} 할인)
        </p>
      )}
    </>
  );
};
