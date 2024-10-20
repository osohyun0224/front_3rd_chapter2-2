import { useState } from "react";
import { Coupon } from "../../types.ts";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => {
      const exists = prevCoupons.some(coupon => coupon.code === newCoupon.code);
      if (exists) {
        console.error("이미 쿠폰이 존재해 새로 등록할 수 없습니다.", newCoupon.code);
        return prevCoupons;
      }
      return [...prevCoupons, newCoupon];
    });
  };

  return { coupons, addCoupon };
};
