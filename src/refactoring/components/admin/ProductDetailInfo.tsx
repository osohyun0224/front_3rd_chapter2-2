import { Discount, Product } from '../../../types';
import { Button, Input, TitleLabel } from '../atoms';
import { InputField } from '../organisms';
import { FC } from 'react';

type ProductDetailInfoProps = {
  product: Product;
  productForm: Product;
  discount: Discount;
  onChangeProduct: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDiscount: (discount: Discount) => void;
  onClickRemoveDiscount: (productId: string, index: number) => void;
  onClickAddDiscount: (productId: string) => void;
  onClickEditComplete: () => void;
};

export const ProductDetailInfo: FC<ProductDetailInfoProps> = ({
  product,
  productForm,
  discount,
  onChangeProduct,
  onChangeDiscount,
  onClickRemoveDiscount,
  onClickAddDiscount,
  onClickEditComplete,
}) => {
  return (
    <div className="mt-2">
      <div>
        <div className="mb-4">
          <div className="mb-2">
            <InputField
              label="상품명"
              type="text"
              name="name"
              id={product.id}
              value={productForm.name}
              onChange={onChangeProduct}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2">
            <InputField
              label="가격"
              type="number"
              id={product.id}
              name="price"
              value={productForm.price}
              onChange={onChangeProduct}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2">
            <InputField
              label="재고"
              type="number"
              id={product.id}
              name="stock"
              value={productForm.stock}
              onChange={onChangeProduct}
            />
          </div>
        </div>

        <div>
          <TitleLabel level={'h4'}>할인 정보</TitleLabel>
          {productForm.discounts.map((discount, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>
                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
              </span>
              <Button
                color="error"
                size="small"
                text="삭제"
                onClick={() => onClickRemoveDiscount(product.id, index)}
              />
            </div>
          ))}

          <div className="flex space-x-2">
            <Input
              id="discountQuantity"
              type="number"
              placeholder="수량"
              value={discount.quantity}
              onChange={(e) =>
                onChangeDiscount({ ...discount, quantity: parseInt(e.target.value) })
              }
              size="small"
            />
            <Input
              id="discountRate"
              type="number"
              placeholder="할인율 (%)"
              value={discount.rate * 100}
              onChange={(e) =>
                onChangeDiscount({ ...discount, rate: parseInt(e.target.value) / 100 })
              }
              size="small"
            />

            <Button
              size="small"
              text="할인 추가"
              className="w-1/3"
              onClick={() => onClickAddDiscount(product.id)}
            />
          </div>
        </div>

        <Button color="success" size="small" text="수정 완료" className="mt-2" onClick={onClickEditComplete} />
      </div>
    </div>
  );
};
