import { useCallback, useState } from 'react';
import { Coupon } from '../../types';
import { isValidCoupon } from './utils';

interface CouponManageProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const useManageCoupons = ({ onCouponAdd }: CouponManageProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleChangeCoupon = useCallback(
    <T extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) => {
      const { name, value } = e.target;
      setNewCoupon((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAddCoupon = useCallback(() => {
    if (!isValidCoupon(newCoupon)) return;

    onCouponAdd(newCoupon);
    setNewCoupon({ name: '', code: '', discountType: 'percentage', discountValue: 0 });
  }, [newCoupon, onCouponAdd]);

  return {
    newCoupon,
    handleChangeCoupon,
    handleAddCoupon,
  };
};
