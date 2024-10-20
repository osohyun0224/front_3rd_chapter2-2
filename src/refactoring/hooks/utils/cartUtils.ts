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

