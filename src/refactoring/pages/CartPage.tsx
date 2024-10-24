import { Coupon, Product } from '../../types.ts'
import { useCart } from '../hooks'
import { CartDetail, ProductContent, SectionTemplate, ItemListTemplate, CardTemplate, PageTemplate, CouponDropdown, PaymentResult } from '../components'

interface Props {
  products: Product[]
  coupons: Coupon[]
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    calculateTotal,
  } = useCart()
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  return (
    <PageTemplate title="장바구니">
      <SectionTemplate title="상품 목록">
        <ItemListTemplate>
          {products.map((product) => (
            <ProductContent
              key={product.id}
              product={product}
              getRemainingStock={getRemainingStock}
              onClickAddToCart={addToCart}
            />
          ))}
        </ItemListTemplate>
      </SectionTemplate>

      <SectionTemplate title="장바구니 내역">
        <ItemListTemplate>
          {cart.map((item) => (
            <CartDetail
              key={item.product.id}
              item={item}
              onClickUpdateQuantity={updateQuantity}
              onClickRemoveCart={removeFromCart}
            />
          ))}
        </ItemListTemplate>

        <CardTemplate title="쿠폰 적용">
          <CouponDropdown coupons={coupons} selectedCoupon={selectedCoupon} onChangeApplyCoupon={applyCoupon} />
        </CardTemplate>

        <CardTemplate title="주문 요약">
          <PaymentResult
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
            totalDiscount={totalDiscount}
          />
        </CardTemplate>
      </SectionTemplate>
    </PageTemplate>
  )
}
