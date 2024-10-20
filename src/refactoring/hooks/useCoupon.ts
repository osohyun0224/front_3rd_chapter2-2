import { useState } from "react";
import { Coupon } from "../../types.ts";

/**
 * @function useCoupons
 * @description 초기 쿠폰 목록을 기반으로 쿠폰 상태를 관리하는 커스텀 훅
 *
 * @param {Coupon[]} initialCoupons - 초기에 설정할 쿠폰 목록
 * @returns {object} 쿠폰 관리 객체
 */

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => {
      const exists = prevCoupons.some(coupon => coupon.code === newCoupon.code);
      if (exists) {
        alert("이미 쿠폰이 존재해 새로 등록할 수 없습니다.");
        return prevCoupons;
      }
      return [...prevCoupons, newCoupon];
    });
  };

  return { coupons, addCoupon };
};