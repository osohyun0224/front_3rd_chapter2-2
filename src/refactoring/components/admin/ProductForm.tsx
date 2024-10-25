import { FC, useMemo } from 'react';
import { CardTemplate } from '../common-ui/layout';
import { Product } from '../../../types';
import { Button } from '../common-ui/atoms';
import { InputField } from '../common-ui/organisms';
import { areAllValuesEmpty } from '../../hooks/utils';

type ProductFormProps = {
  isVisible: boolean;
  product: Omit<Product, 'id'>;
  onChangeProduct: (product: Omit<Product, 'id'>) => void;
  onClickAddProduct: () => void;
};

export const ProductForm: FC<ProductFormProps> = ({
  isVisible,
  product,
  onChangeProduct,
  onClickAddProduct,
}) => {
  const buttonColor = useMemo(() => {
    const isDisabled = areAllValuesEmpty(product.name, product.price, product.stock);
    return isDisabled ? 'disabled' : 'add';
  }, [product]);

  const handleChange = (field: keyof Product, value: any) => {
    onChangeProduct({ ...product, [field]: value });
  };

  return (
    isVisible && (
      <CardTemplate title="새 상품 추가">
        <InputField
          id="productName"
          label="상품명"
          type="text"
          value={product.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <InputField
          id="productPrice"
          label="가격"
          type="number"
          value={product.price}
          onChange={(e) => handleChange('price', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <InputField
          id="productStock"
          label="재고"
          type="number"
          value={product.stock}
          onChange={(e) => handleChange('stock', parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <Button color={buttonColor} size="flex" text="추가" onClick={onClickAddProduct} />
      </CardTemplate>
    )
  );
};
