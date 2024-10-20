import { useState } from 'react';
import { Product } from '../../types.ts';

/**
 * @function useProducts
 * @description 상품 데이터를 관리하는 커스텀 훅
 * 초기 상품 목록을 상태로 저장하고, 새 상품 추가 및 기존 상품의 업데이트 기능을 제공
 *
 * @param {Product[]} initialProducts - 훅을 초기화할 때 사용될 상품 목록
 * @returns {object} 상품 관리와 관련된 상태와 함수들을 포함하는 객체
 */

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  /**
   * @function addProduct
   * @description 새 상품을 상품 목록에 추가
   * @param {Product} newProduct - 추가할 새 상품
   */

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => {
      const exists = prevProducts.some((product) => product.id === newProduct.id);
      if (exists) {
        alert('이 ID를 가진 상품이 이미 존재합니다.');
        return prevProducts;
      }
      return [...prevProducts, newProduct];
    });
  };
    
  /**
   * @function updateProduct
   * @description 상품 목록에서 특정 상품의 정보를 업데이트하고 상품 ID를 기준으로 해당 상품을 찾아 정보를 갱신
   * @param {Product} updatedProduct - 업데이트할 상품 정보를 포함하고 있는 상품 객체
   */

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
