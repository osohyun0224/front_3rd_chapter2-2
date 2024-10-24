import { AdminPage, CartPage } from './index';
import { useCoupon, useProduct, useAdminCheckedContext } from '../hooks';
import { initialCoupons, initialProducts } from '../data';

export const MainPage = () => {
  const { isAdmin } = useAdminCheckedContext();
  const { products, updateProduct, addProduct } = useProduct(initialProducts);
  const { coupons, addCoupon } = useCoupon(initialCoupons);

  return (
    <>
      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          onProductUpdate={updateProduct}
          onProductAdd={addProduct}
          onCouponAdd={addCoupon}
        />
      ) : (
        <CartPage products={products} coupons={coupons} />
      )}
    </>
  );
};
