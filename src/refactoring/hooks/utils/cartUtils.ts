import { CartItem, Coupon, Discount  } from '../../../types';

/**
 * @function calculateItemTotal
 * @description 주어진 항목의 총 가격을 계산합
 * @param {CartItem} item - 총 가격을 계산할 카트 항목
 * @param {boolean} applyDiscount - 할인 적용 여부
 * @returns {number} 할인이 적용된 항목의 총 가격
 */

export function calculateItemTotal(cart: CartItem): number {
  const discount = getMaxApplicableDiscount(cart)
  const totalAfterDiscount = calculateApplyDiscountedPrice(cart, discount)
  return Math.round(totalAfterDiscount)
}


/**
 * @function calculateMaxDiscount
 * @description 한 상품의 최대의 할인율을 계산
 * @param {Discount[]} discounts 초기 설정된 할인 정보
 * @param {number} quantity 한 상품의 수량
 * @returns {number} 한 상품의 최대의 할인율
 */
export function calculateMaxDiscount(discounts: Discount[], quantity: number): number {
  return discounts.reduce(
    (max, discount) => (quantity >= discount.quantity ? Math.max(max, discount.rate) : max),
    0
  )
}

/**
 * @function getMaxApplicableDiscount
 * @description  주어진 항목에 적용 가능한 최대 할인율을 계산
 * @param {CartItem} item - 최대 할인율을 계산할 카트 항목
 * @returns {number} 적용 가능한 최대 할인율
 */

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce(
    (max, discount) => (quantity >= discount.quantity ? Math.max(max, discount.rate) : max),
    0
  );
};

/**
 * @function applyCoupon
 * @description 총액에 쿠폰 할인을 적용
 * @param {number} total - 쿠폰을 적용하기 전의 총액
 * @param {Coupon | null} coupon - 적용할 쿠폰
 * @returns {number} 쿠폰이 적용된 후의 총액
 */

const applyCoupon = (total: number, coupon: Coupon | null) => {
  if (!coupon) return total;
  const { discountType, discountValue } = coupon;

  return discountType === 'amount'
    ? Math.max(0, total - discountValue)
    : total * (1 - discountValue / 100);
};

/**
 * @function calculateApplyDiscountedPrice
 * @description 한개의 상품에 이미 할인된 가격을 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @param {number} discount 할인 율
 * @returns {number} 총 할인된 가격
 */

export function calculateApplyDiscountedPrice(cart: CartItem, discount: number) {
  return cart.product.price * cart.quantity * (1 - discount)
}

/**
 * @function calculateCartTotal
 * @description 장바구니의 총액을 계산
 * @param {CartItem[]} cart - 총액을 계산할 장바구니 항목 들
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰
 * @returns {object} 할인 전 총액, 할인 후 총액, 총 할인액을 포함하는 객체
 */

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount =  calculateTotalBeforeDiscount(cart)
  const totalAfterDiscount = calculateTotalAfterDiscount(cart)
  const totalAfterCoupon = applyCoupon(totalAfterDiscount, selectedCoupon);
  const totalDiscount = totalBeforeDiscount - totalAfterCoupon;

  return {
    totalBeforeDiscount: roundInt(totalBeforeDiscount),
    totalAfterDiscount: roundInt(totalAfterCoupon),
    totalDiscount: roundInt(totalDiscount),
  };
};

/**
 * @function roundInt
 * @description 정수로 변환하는 함수
 * @param {number} amount 정수로 변환하려고 하는 값
 * @returns {number} 최종 변환된 값
 */
export function roundInt(amount: number): number {
  return Math.round(amount)
}

/**
 * @function calculateTotalBeforeDiscount
 * @description 장바구니의 상품 할인 적용 전 총액 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @returns {number} 할인 적용 전의 총 금액
 */
export function calculateTotalBeforeDiscount(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

/**
 * @function calculateTotalAfterDiscount
 * @description 장바구니의 상품 할인 적용 후 총액 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @returns {number} 할인 적용 후의 총 금액
 */
export function calculateTotalAfterDiscount(cart: CartItem[]) {
  return cart.reduce((total, item) => {
    const discount = getMaxApplicableDiscount(item)
    return total + calculateApplyDiscountedPrice(item, discount)
  }, 0)
}

/**
 * @function updateCartItemQuantity
 * @description 카트 내 특정 상품의 수량을 업데이트
 * @param {CartItem[]} cart - 업데이트할 장바구니
 * @param {string} productId - 수량을 업데이트할 상품의 ID
 * @param {number} newQuantity - 새로운 수량
 * @returns {CartItem[]} 업데이트된 장바구니
**/

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id !== productId) return item;

      const updatedQuantity = Math.max(0, Math.min(newQuantity, item.product.stock));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    })
    .filter((item): item is CartItem => item !== null);
};

export function updateSet(set: Set<string>, id: string): Set<string> {
  const newSet = new Set(set);
  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
  return newSet;
}

export function isValidCoupon(coupon: Coupon): boolean {
  return coupon.name !== '' && coupon.code !== '' && coupon.discountValue !== 0;
}