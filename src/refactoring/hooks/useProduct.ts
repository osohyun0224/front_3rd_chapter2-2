import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) => 
      prevProducts.map((product) => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => {
      const exists = prevProducts.some(product => product.id === newProduct.id);
      if (exists) {
        console.error("이 ID를 가진 상품이 이미 존재해 상품을 등록할 수 없습니다.", newProduct.id);
        return prevProducts;
      }
      return [...prevProducts, newProduct];
    });
  };

  return {
    products,
    updateProduct,
    addProduct
  };
};
