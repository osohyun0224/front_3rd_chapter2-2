import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => {
      const exists = prevProducts.some(product => product.id === newProduct.id);
      if (exists) {
        alert("이 ID를 가진 상품이 이미 존재합니다.");
        return prevProducts;
      }
      return [...prevProducts, newProduct];
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) => 
      prevProducts.map((product) => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  return {
    products,
    updateProduct,
    addProduct
  };
};