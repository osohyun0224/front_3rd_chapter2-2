import { useCallback, useState } from 'react'
import { CartItem, Coupon, Product } from '../../types'
import { calculateCartTotal, updateCartItemQuantity, roundInt }  from './utils'

/**
 * @function useCart
 * @description 사용자의 장바구니 상태를 관리하는 훅
 * @summary 계산 > calculateCartTotal, updateCartItemQuantity, roundInt 사용
 * 장바구니 내의 상품 목록 관리, 상품 추가 및 제거, 수량 업데이트, 쿠폰 적용, 총 금액 계산 기능
 * @returns {object} 장바구니 관리에 필요한 상태와 함수들을 포함하는 객체
 */

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const findCartItemById = useCallback((cart: CartItem[], productId: string) => {
    return cart.find(({ product }) => product.id === productId)
  }, [])

  const getRemainingStock = useCallback(
    (id: string, stock: number) => {
      const cartItem = findCartItemById(cart, id)
      return stock - (cartItem?.quantity || 0)
    },
    [cart],
  )

  /**
   * @function addToCart
   * @description 장바구니에 상품을 추가하거나, 이미 존재하는 상품의 수량을 증가
   *
   * @param {Product} product - 장바구니에 추가하거나 수량을 증가시킬 상품 객체
   */

  const addToCart = useCallback((product: Product) => {
    const { id, stock } = product

    if (!getRemainingStock(id, stock)) return

    setCart((prevCart) => {
      const existingItem = findCartItemById(prevCart, id)
      return existingItem ? updateCartItem(prevCart, id) : [...prevCart, { product, quantity: 1 }]
    })
  }, [])

  const updateCartItem = useCallback((cart: CartItem[], productId: string) => {
    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) } : item,
    )
  }, [])

  /**
   * @function removeFromCart
   * @description 상품을 장바구니에서 제거하는 함수
   */

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  /**
   * @function updateQuantity
   * @description 장바구니 내 상품의 수량을 업데이트하는 함수
   */

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  /**
   * @function applyCoupon
   * @description 쿠폰을 적용하는 함수
   */

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };
  /**
   * @function calculateTotal
   * @description 총 금액을 계산하는 함수
   */
  const calculateTotal = useCallback(() => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateCartTotal(cart, selectedCoupon)
    return {
      totalBeforeDiscount: roundInt(totalBeforeDiscount),
      totalAfterDiscount: roundInt(totalAfterDiscount),
      totalDiscount: roundInt(totalDiscount),
    }
  }, [cart, selectedCoupon])

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
  }
}
