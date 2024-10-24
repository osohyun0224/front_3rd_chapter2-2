import { CartItem, Coupon, Discount } from '../../../types';

/**
 * @function roundInt
 * @description 정수로 변환하는 함수
 * @param {number} amount 정수로 변환하려고 하는 값
 * @returns {number} 최종 변환된 값
 */
export function roundInt(amount: number): number {
  return Math.round(amount);
}

/**
 * @function formatKrPrice
 * @description 금액을 숫자로 변환
 * @param {number} amount 변환하려고 하는 금액
 * @returns {string} 숫자로 변환된 금액
 */
export function formatKrPrice(amount: number): string {
  return amount.toLocaleString();
}

/**
 * @function discountChangeFormat
 * @description 할인 금액의 형식을 반환
 * @param {Coupon} coupon 대상이 되는 쿠폰
 * @returns {string} 변환된 형식
 */
export function discountChangeFormat(coupon: Coupon) {
  return coupon.discountType === 'amount' ? '원' : '%';
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
  );
}

/**
 * @function getMaxDiscount
 * @description 전체 할인 목록 중 최대 할인율을 구함
 * @param {Discount[]} discounts 할인 목록
 * @returns {number} 최대 할인율
 */
export function getMaxDiscount(discounts: Discount[]): number {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
}

/**
 * @function getMaxApplicableDiscount
 * @description 장바구니 항목들을 가지고 그 안에 있는 상품의 할인 정보와 수량을 추출해 최대 할인율을 계산
 * @param {CartItem} cart - 최대 할인율을 계산을 진행할 장바구니 항목
 * @returns {number} 적용 가능한 최대 할인율
 */
export function getMaxApplicableDiscount(cart: CartItem) {
  return calculateMaxDiscount(cart.product.discounts, cart.quantity);
}

/**
 * @function calculateApplyDiscountedPrice
 * @description 한개의 상품에 이미 할인된 가격을 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @param {number} discount 할인 율
 * @returns {number} 총 할인된 가격
 */
export function calculateApplyDiscountedPrice(cart: CartItem, discount: number) {
  return cart.product.price * cart.quantity * (1 - discount);
}

/**
 * @function calculateItemTotal
 * @description 최대 할인 적용 후 최종 가격을 계산하는 함수
 * @param {CartItem} item - 장바구니 항목
 * @returns {number} - 할인이 적용된 최종 금액
 */
export function calculateItemTotal(cart: CartItem) {
  const discount = getMaxApplicableDiscount(cart);
  const totalAfterDiscount = calculateApplyDiscountedPrice(cart, discount);
  return roundInt(totalAfterDiscount);
}

/**
 * @function calculateTotalBeforeDiscount
 * @description 장바구니의 상품 할인 적용 전 총액 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @returns {number} 할인 적용 전의 총 금액
 */
export function calculateTotalBeforeDiscount(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

/**
 * @function calculateTotalAfterDiscount
 * @description 장바구니의 상품 할인 적용 후 총액 계산
 * @param {CartItem[]} cart 장바구니 항목들
 * @returns {number} 할인 적용 후의 총 금액
 */
export function calculateTotalAfterDiscount(cart: CartItem[]) {
  return cart.reduce((total, item) => {
    const discount = getMaxApplicableDiscount(item);
    return total + calculateApplyDiscountedPrice(item, discount);
  }, 0);
}

/**
 * @function applyCouponDiscount
 * @description 총액에 쿠폰 할인을 적용
 * @param {number} total - 쿠폰을 적용하기 전의 총액
 * @param {Coupon | null} coupon - 적용할 쿠폰
 * @returns {number} 쿠폰이 적용된 후의 총액
 */
export function applyCouponDiscount(total: number, coupon: Coupon | null) {
  if (!coupon) return total;
  const { discountType, discountValue } = coupon;

  return discountType === 'amount'
    ? Math.max(0, total - discountValue)
    : total * (1 - discountValue / 100);
}

/**
 * @function calculateTotalDiscount
 * @description 총 할인 금액을 계산
 * @param {number} totalBeforeDiscount 할인 적용 전 금액
 * @param {number} totalAfterDiscount 할인 적용 후 금액
 * @returns {number} 계산된 총 할인 금액
 */
export function calculateTotalDiscount(
  totalBeforeDiscount: number,
  totalAfterDiscount: number
): number {
  return totalBeforeDiscount - totalAfterDiscount;
}

/**
 * @function calculateCartTotal
 * @description 장바구니의 총액을 계산
 * @param {CartItem[]} cart - 총액을 계산할 장바구니 항목 들
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰
 * @returns {object} 할인 전 총액, 할인 후 총액, 총 할인액을 포함하는 객체
 */
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
  const totalAfterDiscount = calculateTotalAfterDiscount(cart);
  const totalAfterCoupon = applyCouponDiscount(totalAfterDiscount, selectedCoupon);
  const totalDiscount = calculateTotalDiscount(totalBeforeDiscount, totalAfterCoupon);

  return {
    totalBeforeDiscount: roundInt(totalBeforeDiscount),
    totalAfterDiscount: roundInt(totalAfterCoupon),
    totalDiscount: roundInt(totalDiscount),
  };
};

/**
 * @function updateQuantity
 * @description 한 상품의 수량을 업데이트
 * @param {CartItem} item - 업데이트할 상품이 포함된 장바구니 항목
 * @param {string} productId - 수량을 업데이트할 상품의 ID
 * @param {number} newQuantity - 새로운 수량
 * @returns {CartItem} 업데이트된 상품의 정보를 담은 장바구니 항목
 */
export function updateQuantity(item: CartItem, productId: string, newQuantity: number): CartItem {
  if (item.product.id === productId) {
    const maxQuantity = item.product.stock;
    const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
    return { ...item, quantity: updatedQuantity };
  }
  return item;
}

/**
 * @function updateCartItemQuantity
 * @description 카트 내 모든 상품을 보고 수량이 0 이상인 상품만을 필터링해 반환
 * @param {CartItem[]} cart - 업데이트할 장바구니
 * @param {string} productId - 수량을 업데이트할 상품의 ID
 * @param {number} newQuantity - 새로운 수량
 * @returns {CartItem[]} 업데이트된 장바구니의 상품 목록
 **/
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] {
  return cart
    .map((item) => updateQuantity(item, productId, newQuantity))
    .filter(({ quantity }) => quantity > 0);
}

/**
 * @function updateSet
 * @description 주어진 Set에서 ID를 토글 상태를 업데이트
 * @param {Set<string>} set - 토글할 ID가 포함된 문자열 Set
 * @param {string} id - 토글할 ID
 * @returns {Set<string>} 토글된 결과의 새로운 Set을 반환
 */
export function updateSet(set: Set<string>, id: string): Set<string> {
  const newSet = new Set(set);
  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
  return newSet;
}

/**
 * @function isValidCoupon
 * @description 쿠폰 객체가 유효한지 검사하는 함수
 * @param {Coupon} coupon - 검사할 쿠폰 객체
 * @returns {boolean} 쿠폰의 이름, 코드가 비어있지 않고, 할인값이 0이 아닐 경우 true를 반환
 */
export function isValidCoupon(coupon: Coupon): boolean {
  return coupon.name !== '' && coupon.code !== '' && coupon.discountValue !== 0;
}
