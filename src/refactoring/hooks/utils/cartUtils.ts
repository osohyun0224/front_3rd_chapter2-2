import { CartItem } from "../../../types";

export const calculateItemTotal = (item: CartItem, applyDiscount: boolean = true) => {
  const { product: { price }, quantity } = item;
  const discountMultiplier = applyDiscount ? (1 - getMaxApplicableDiscount(item)) : 1;
  return price * quantity * discountMultiplier;
};


export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce((max, discount) => (
    quantity >= discount.quantity ? Math.max(max, discount.rate) : max
  ), 0);
};


const applyCoupon = (total: number, coupon: Coupon | null) => {
  if (!coupon) return total;
  const { discountType, discountValue } = coupon;
  
  return discountType === "amount"
    ? Math.max(0, total - discountValue)
    : total * (1 - discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => total + calculateItemTotal(item, false), 0);
  const totalAfterDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  const totalAfterCoupon = applyCoupon(totalAfterDiscount, selectedCoupon);
  const totalDiscount = totalBeforeDiscount - totalAfterCoupon;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCoupon),
    totalDiscount: Math.round(totalDiscount)
  };
};
