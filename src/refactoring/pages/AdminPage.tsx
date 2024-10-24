import { Coupon, Product } from '../../types.ts';
import {
  Button,
  CardTemplate,
  PageTemplate,
  SectionTemplate,
  CouponForm,
  CouponList,
  ProductForm,
  ProductItem,
  ProductDetailInfo,
  ProductDetail,
  ItemListTemplate,
} from '../components';
import { useToggleAccordion, useManageCoupons, useManageProducts } from '../hooks';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const { openItems, toggleProducts } = useToggleAccordion();
  const { newCoupon, handleChangeCoupon, handleAddCoupon } = useManageCoupons({ onCouponAdd });
  const {
    editingProduct,
    newProduct,
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  } = useManageProducts({ products, onProductUpdate, onProductAdd });

  return (
    <PageTemplate title="관리자 페이지">
      <SectionTemplate title="상품 관리">
        <Button
          color="success"
          size="medium"
          text={isNewProductForm ? '취소' : '새 상품 추가'}
          onClick={toggleNewProductForm}
        />

        <ProductForm
          isVisible={isNewProductForm}
          product={newProduct}
          onChangeProduct={setNewProduct}
          onClickAddProduct={handleAddNewProduct}
        />

        <ItemListTemplate>
          {products.map((product, index) => (
            <ProductItem
              key={index}
              product={product}
              index={index}
              toggleProducts={toggleProducts}
            >
              {openItems.has(product.id) && (
                <div className="mt-4">
                  {editingProduct?.id === product.id ? (
                    <ProductDetailInfo
                      product={product}
                      productForm={editingProduct}
                      discount={newDiscount}
                      onChangeProduct={handleUpdateProduct}
                      onChangeDiscount={setNewDiscount}
                      onClickRemoveDiscount={handleRemoveDiscount}
                      onClickEditComplete={handleEditComplete}
                      onClickAddDiscount={handleAddDiscount}
                    />
                  ) : (
                    <ProductDetail product={product} onClickEditProduct={handleEditProduct} />
                  )}
                </div>
              )}
            </ProductItem>
          ))}
        </ItemListTemplate>
      </SectionTemplate>

      <SectionTemplate title="쿠폰 관리">
        <CardTemplate>
          <CouponForm
            newCoupon={newCoupon}
            onChangeCoupon={handleChangeCoupon}
            onClickAddCoupon={handleAddCoupon}
          />
          <CouponList coupons={coupons} />
        </CardTemplate>
      </SectionTemplate>
    </PageTemplate>
  );
};
