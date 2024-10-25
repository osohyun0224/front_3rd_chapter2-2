import { Coupon } from '../../../types';
import { ItemListTemplate } from '../common-ui/layout';
import { FC } from 'react';
import { Button, Input } from '../common-ui/atoms';
import { Select } from '../common-ui/atoms';

type CouponFormProps = {
  newCoupon: Coupon;
  onChangeCoupon: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClickAddCoupon: () => void;
};

export const CouponForm: FC<CouponFormProps> = ({
  newCoupon,
  onChangeCoupon,
  onClickAddCoupon,
}) => {
  const isDisabledSubmit = !newCoupon.name || !newCoupon.code || !newCoupon.discountValue;

  return (
    <ItemListTemplate>
      <Input
        type="text"
        placeholder="쿠폰 이름"
        name="name"
        value={newCoupon.name}
        onChange={onChangeCoupon}
      />

      <Input
        type="text"
        placeholder="쿠폰 코드"
        name="code"
        value={newCoupon.code}
        onChange={onChangeCoupon}
      />

      <div className="flex gap-2">
        <Select
          name="discountType"
          value={newCoupon.discountType}
          onChange={onChangeCoupon}
          options={[
            { value: 'amount', label: '금액(원)' },
            { value: 'percentage', label: '할인율(%)' },
          ]}
        />

        <Input
          type="number"
          placeholder="할인 값"
          name="discountValue"
          value={newCoupon.discountValue.toString()}
          onChange={onChangeCoupon}
        />
      </div>

      <Button
        color={isDisabledSubmit ? 'disabled' : 'success'}
        text="쿠폰 추가"
        className="w-full mt-2"
        size="large"
        onClick={onClickAddCoupon}
        disabled={isDisabledSubmit}
      />
    </ItemListTemplate>
  );
};
