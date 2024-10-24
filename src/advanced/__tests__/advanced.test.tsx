import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen, within, renderHook} from '@testing-library/react';
import { CartPage } from '../../refactoring/pages/CartPage';
import { AdminPage } from '../../refactoring/pages/AdminPage';
import { Coupon, Product, CartItem} from '../../types';
import { useToggleAccordion, useManageCoupons, useManageProducts } from '../../refactoring/hooks';
import * as cartUtils from '../../refactoring/hooks/utils';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);


  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {

      render(<CartPage products={mockProducts} coupons={mockCoupons}/>);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {


    describe('Custom Hooks 테스트', () => {
      describe('useToggleAccordion 커스텀 훅 테스트', () => {
        test('훅을 처음 사용할 때 아이템들이 열리지 않았으면 아무 아이템도 열려있지 않아야 한다', () => {
            const { result } = renderHook(() => useToggleAccordion());
            expect(result.current.openItems.size).toBe(0);
        });
    
        test('아이템을 토글로 추가하면 해당 아이템들이 열려야 한다', () => {
            const { result } = renderHook(() => useToggleAccordion());
    
            act(() => {
                result.current.toggleProducts('item1');
                result.current.toggleProducts('item2');
            });
    
            expect(result.current.openItems.size).toBe(2);
            expect(result.current.openItems.has('item1')).toBe(true);
            expect(result.current.openItems.has('item2')).toBe(true);
        });
    
        test('열린 아이템 중 하나를 다시 토글하면 그 아이템은 닫혀야 한다', () => {
            const { result } = renderHook(() => useToggleAccordion());
    
            act(() => {
                result.current.toggleProducts('item1');
                result.current.toggleProducts('item2');
            });
            expect(result.current.openItems.size).toBe(2);
            expect(result.current.openItems.has('item1')).toBe(true);
            expect(result.current.openItems.has('item2')).toBe(true);
    
            act(() => {
                result.current.toggleProducts('item2');
            });
    
            expect(result.current.openItems.size).toBe(1);
            expect(result.current.openItems.has('item1')).toBe(true);
            expect(result.current.openItems.has('item2')).toBe(false);
        });
    
        test('아이템을 토글할 때마다 새로운 Set 객체로 불변성이 유지되어야 한다', () => {
            const { result } = renderHook(() => useToggleAccordion());
            let previousSet = result.current.openItems;
    
            act(() => {
                result.current.toggleProducts('item1');
            });
            expect(result.current.openItems).not.toBe(previousSet);
    
            previousSet = result.current.openItems;
            act(() => {
                result.current.toggleProducts('item2');
            });
            expect(result.current.openItems).not.toBe(previousSet);
        });
    });
    });
    describe('useManageCoupons 커스텀 훅 테스트', () => {
      const mockOnCouponAdd = vi.fn();
      const useManageCouponsProps = {
        onCouponAdd: mockOnCouponAdd,
      };

      const firstCouponState: Coupon = {
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
      };

      beforeEach(() => {
        mockOnCouponAdd.mockClear();
      });

      test('첫 쿠폰 상태가 초기화되면 모든 값이 비어있어야 한다.', () => {
        const { result } = renderHook(() => useManageCoupons(useManageCouponsProps));
        expect(result.current.newCoupon).toEqual(firstCouponState);
      });

      test('쿠폰 정보가 입력되면 해당 정보가 쿠폰 상태에 반영되어야 한다.', () => {
        const { result } = renderHook(() => useManageCoupons(useManageCouponsProps));
        act(() => {
          result.current.handleChangeCoupon({
            target: { name: 'name', value: '소현이의 쿠폰' },
          } as React.ChangeEvent<HTMLInputElement>);
          result.current.handleChangeCoupon({
            target: { name: 'discountValue', value: '20' },
          } as React.ChangeEvent<HTMLInputElement>);
          result.current.handleChangeCoupon({
            target: { name: 'discountType', value: 'quantity' },
          } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.newCoupon).toEqual({
          ...firstCouponState,
          name: '소현이의 쿠폰',
          discountValue: '20',
          discountType: 'quantity',
        });
      });

      test('할인 유형이 변경되면 새로운 할인 유형이 쿠폰 상태에 반영되어야 한다.', () => {
        const { result } = renderHook(() => useManageCoupons(useManageCouponsProps));

        act(() => {
          result.current.handleChangeCoupon({
            target: { name: 'discountType', value: 'amount' },
          } as React.ChangeEvent<HTMLSelectElement>);
        });

        expect(result.current.newCoupon.discountType).toBe('amount');
      });

      test('쿠폰을 추가한 후 콜백 함수가 호출되면 새 쿠폰 정보와 함께 호출되어야 한다.', () => {
        const { result } = renderHook(() => useManageCoupons(useManageCouponsProps));

        act(() => {
          result.current.handleChangeCoupon({
            target: { name: 'name', value: '소현이의 쿠폰' },
          } as React.ChangeEvent<HTMLInputElement>);
          result.current.handleChangeCoupon({
            target: { name: 'code', value: 'OSOHYUN0224' },
          } as React.ChangeEvent<HTMLInputElement>);
          result.current.handleChangeCoupon({
            target: { name: 'discountValue', value: '5000' },
          } as React.ChangeEvent<HTMLInputElement>);
        });

        act(() => {
          result.current.handleAddCoupon();
        });

        expect(mockOnCouponAdd).toHaveBeenCalledWith({
          ...firstCouponState,
          name: '소현이의 쿠폰',
          code: 'OSOHYUN0224',
          discountValue: '5000',
        });

        expect(result.current.newCoupon).toEqual(firstCouponState);
      });
    });

    describe('useManageProducts 커스텀 훅 테스트', () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        price: 4000,
        stock: 20,
        discounts: [],
      };

      const mockProps = {
        products: [mockProduct],
        onProductUpdate: vi.fn(),
        onProductAdd: vi.fn(),
      };

      beforeEach(() => {
        mockProps.onProductUpdate.mockClear();
        mockProps.onProductAdd.mockClear();
      });

      test('초기 상태가 설정되면 새 제품 폼은 비활성화되어야 하고, 새 할인은 초기화되어야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        expect(result.current.editingProduct).toBeNull();
        expect(result.current.isNewProductForm).toBeFalsy();
        expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
      });

      test('제품을 수정 모드로 설정하면 해당 제품의 정보가 수정 상태에 반영되어야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        act(() => {
          result.current.handleEditProduct(mockProduct);
        });
        expect(result.current.editingProduct).toEqual(mockProduct);

        act(() => {
          result.current.handleEditComplete();
        });
        expect(result.current.editingProduct).toBeNull();
        expect(mockProps.onProductUpdate).toHaveBeenCalledWith(mockProduct);
      });

      test('새 할인 정보가 추가되면 제품 정보에 반영되어야 하고, 업데이트 콜백이 호출되어야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        const newDiscount = { quantity: 3, rate: 8 };

        act(() => {
          result.current.handleEditProduct(mockProduct);
        });

        act(() => {
          result.current.setNewDiscount(newDiscount);
        });

        act(() => {
          result.current.handleAddDiscount(mockProduct.id);
        });

        const expectedProduct = {
          ...mockProduct,
          discounts: [newDiscount],
        };
        expect(mockProps.onProductUpdate).toHaveBeenCalledWith(expectedProduct);

        act(() => {
          result.current.handleRemoveDiscount(mockProduct.id, 0);
        });

        expect(mockProps.onProductUpdate).toHaveBeenCalledWith({
          ...mockProduct,
          discounts: [],
        });
      });

      test('여러 제품을 동시에 관리할 때 상태 관리가 정확해야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        const secondMockProduct: Product = {
          ...mockProduct,
          id: '2',
          name: 'Second Test Product',
        };

        act(() => {
          result.current.handleEditProduct(mockProduct);
        });

        act(() => {
          result.current.handleEditProduct(secondMockProduct);
        });

        expect(result.current.editingProduct).toEqual(secondMockProduct);

        act(() => {
          result.current.handleEditComplete();
        });
        expect(result.current.editingProduct).toBeNull();
        expect(mockProps.onProductUpdate).toHaveBeenCalledWith(secondMockProduct);
      });

      test('동시에 여러 제품을 추가하려고 할 때 올바르게 처리되어야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        const firstNewProduct = {
          name: 'First New Product',
          price: 5000,
          stock: 5,
          discounts: [],
        };
        const secondNewProduct = {
          name: 'Second New Product',
          price: 6000,
          stock: 4,
          discounts: [],
        };

        act(() => {
          result.current.setNewProduct(firstNewProduct);
        });
        act(() => {
          result.current.handleAddNewProduct();
        });
        act(() => {
          result.current.setNewProduct(secondNewProduct);
        });
        act(() => {
          result.current.handleAddNewProduct();
        });

        expect(mockProps.onProductAdd).toHaveBeenCalledTimes(2);
        expect(mockProps.onProductAdd).toHaveBeenCalledWith(
          expect.objectContaining({ ...firstNewProduct, id: expect.any(String) })
        );
        expect(mockProps.onProductAdd).toHaveBeenCalledWith(
          expect.objectContaining({ ...secondNewProduct, id: expect.any(String) })
        );
      });

      test('새 제품을 등록하면 새 제품 정보가 콜백을 통해 추가되고, 새 제품 폼은 비활성화되어야 한다.', () => {
        const { result } = renderHook(() => useManageProducts(mockProps));
        const newProduct = {
          name: 'New Product',
          price: 2000,
          stock: 5,
          discounts: [],
        };

        act(() => {
          result.current.toggleNewProductForm();
        });

        act(() => {
          result.current.setNewProduct(newProduct);
        });

        act(() => {
          result.current.handleAddNewProduct();
        });

        expect(mockProps.onProductAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            ...newProduct,
            id: expect.any(String),
          })
        );
        expect(result.current.isNewProductForm).toBeFalsy();
      });
    });
  })
  describe('cartUtils 내부의 일반 계산 함수를 테스트합니다.', () => {
    const createTestProductByUtils = (overrides = {}): Product => ({
      id: 'PRODUCT001',
      name: 'Garden',
      price: 30000,
      stock: 30,
      discounts: [
        { quantity: 4, rate: 0.2 },
        { quantity: 5, rate: 0.3 },
      ],
      ...overrides,
    });

    const createTestCartItemByUtils = (overrides = {}) => ({
      product: createTestProductByUtils(),
      quantity: 1,
      ...overrides,
    });

    describe('calculateMaxDiscount 함수 테스트', () => {
      test('할인 정보가 없을 경우 최대 할인율은 0이어야 한다.', () => {
        expect(cartUtils.calculateMaxDiscount([], 1)).toBe(0);
      });

      test('수량이 할인 기준에 미치지 못할 경우 최대 할인율은 0이어야 한다.', () => {
        const discounts = [{ quantity: 2, rate: 0.1 }];
        expect(cartUtils.calculateMaxDiscount(discounts, 1)).toBe(0);
      });

      test('수량이 특정 할인 기준에 정확히 맞을 경우 해당 할인율이 반환되어야 한다.', () => {
        const discounts = [
          { quantity: 4, rate: 0.2 },
          { quantity: 20, rate: 0.4 },
        ];
        expect(cartUtils.calculateMaxDiscount(discounts, 4)).toBe(0.2);
        expect(cartUtils.calculateMaxDiscount(discounts, 20)).toBe(0.4);
      });

      test('수량이 여러 할인 기준을 만족할 경우 가장 높은 할인율이 반환되어야 한다.', () => {
        const discounts = [
          { quantity: 5, rate: 0.1 },
          { quantity: 10, rate: 0.2 },
          { quantity: 15, rate: 0.3 },
        ];
        expect(cartUtils.calculateMaxDiscount(discounts, 20)).toBe(0.3);
      });

      test('중복된 할인율이 설정된 여러 조건이 존재할 경우 가장 높은 할인율이 반환되어야 한다.', () => {
        const discounts = [
          { quantity: 3, rate: 0.1 },
          { quantity: 3, rate: 0.1 },
          { quantity: 10, rate: 0.2 },
        ];
        expect(cartUtils.calculateMaxDiscount(discounts, 10)).toBe(0.2);
      });

      test('다른 조건에 동일한 할인율이 설정되었을 경우 해당 수량에 맞는 할인율이 반환되어야 한다.', () => {
        const discounts = [
          { quantity: 5, rate: 0.15 },
          { quantity: 10, rate: 0.15 },
        ];
        expect(cartUtils.calculateMaxDiscount(discounts, 5)).toBe(0.15);
        expect(cartUtils.calculateMaxDiscount(discounts, 10)).toBe(0.15);
      });
    });

    describe('calculateApplyDiscountedPrice 함수 테스트', () => {
      test('장바구니에 들어있는 상품들에 할인이 적용되지 않을 때, 원래 가격을 그대로 반환해야 한다', () => {
        const cartItem = createTestCartItemByUtils();
        expect(cartUtils.calculateApplyDiscountedPrice(cartItem, 0)).toBe(30000);
      });

      test('장바구니에 있는 상품들에게 적절한 할인율이 적용되었을 때, 할인된 가격을 정확히 계산해야 한다', () => {
        const cartItem = createTestCartItemByUtils({ quantity: 5 });
        expect(cartUtils.calculateApplyDiscountedPrice(cartItem, 0.3)).toBe(105000);
      });

      test('할인율이 100%일 때, 결과 가격은 0이어야 한다', () => {
        const cartItem = createTestCartItemByUtils({ quantity: 1 });
        expect(cartUtils.calculateApplyDiscountedPrice(cartItem, 1)).toBe(0);
      });
    });

    describe('getMaxApplicableDiscount 함수 테스트', () => {
      test('장바구니에 들어 있는 상품들이 할인 조건을 충족하지 않으면 0을 반환해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 1 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0);
      });

      test('장바구니에 들어 있는 상품들이 적용 가능한 최고 할인율을 충족하는 경우 해당 할인율을 반환해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 5 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.3);
      });

      test('장바구니에 들어 있는 상품들이 할인 조건을 정확히 충족할 경우, 해당 조건의 할인율을 반환해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 4 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.2);
      });

      test('여러개의 할인 조건 중 가장 높은 할인율이 적용되어야 한다.', () => {
        const item: CartItem = {
          product: createTestProductByUtils({
            discounts: [
              { quantity: 2, rate: 0.1 },
              { quantity: 3, rate: 0.25 },
              { quantity: 4, rate: 0.5 },
            ],
          }),
          quantity: 4,
        };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.5);
      });

      test('주어진 상품의 할인 조건에 명시된 수량을 초과하더라도 최대 할인율을 반환해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 6 };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.3);
      });

      test('할인 정보가 없는 상품일 경우 0을 반환해야 한다.', () => {
        const item: CartItem = {
          product: createTestProductByUtils({ discounts: [] }),
          quantity: 1,
        };
        expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0);
      });
    });

    describe('calculateItemTotal 함수 테스트', () => {
      test('장바구니에 들어 있는 상품들이 할인 조건에 미치지 못할 경우, 할인 없이 총액을 계산해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 3 };
        expect(cartUtils.calculateItemTotal(item)).toBe(90000);
      });

      test('장바구니에 들어 있는 상품들이 할인 조건을 충족할 경우, 할인 후 총액을 계산해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 4 };
        expect(cartUtils.calculateItemTotal(item)).toBe(96000);
      });

      test('장바구니에 들어 있는 상품들이 할인 조건을 크게 초과할 경우, 최대 할인률로 총액을 계산해야 한다.', () => {
        const item: CartItem = { product: createTestProductByUtils(), quantity: 5 };
        expect(cartUtils.calculateItemTotal(item)).toBe(105000);
      });

      test('상품에 할인 정보가 없을 경우, 원래 가격의 총액을 반환해야 한다.', () => {
        const noDiscountProduct = createTestProductByUtils({ discounts: [] });
        const item: CartItem = { product: noDiscountProduct, quantity: 4 };
        expect(cartUtils.calculateItemTotal(item)).toBe(120000);
      });
    });

    describe('calculateTotalBeforeDiscount 함수 테스트', () => {
      test('계산하는 장바구니가 비어 있을 경우 총 가격은 0이어야 한다.', () => {
        expect(cartUtils.calculateTotalBeforeDiscount([])).toBe(0);
      });

      test('상품들이 담겨져 있는 장바구니에 할인 적용 전 총액은 상품들의 가격과 수량에 따른 합이어야 한다.', () => {
        const cart = [
          { product: createTestProductByUtils({ price: 10000 }), quantity: 2 },
          { product: createTestProductByUtils({ price: 20000 }), quantity: 1 },
        ];
        expect(cartUtils.calculateTotalBeforeDiscount(cart)).toBe(40000);
      });

      test('여러개의 상품들이 장바구니에 있을 때, 각 상품의 가격과 수량을 곱한 값들의 합이 총액이어야 한다.', () => {
        const cart = [
          { product: createTestProductByUtils({ price: 5000 }), quantity: 3 },
          { product: createTestProductByUtils({ price: 15000 }), quantity: 2 },
          { product: createTestProductByUtils({ price: 20000 }), quantity: 1 },
        ];
        expect(cartUtils.calculateTotalBeforeDiscount(cart)).toBe(65000);
      });

      test('해당 상품에 할인 정보가 있더라도 할인 적용 전 총액 계산에 영향을 주지 않아야 한다.', () => {
        const cart = [
          {
            product: createTestProductByUtils({
              price: 10000,
              discounts: [{ quantity: 2, rate: 10 }],
            }),
            quantity: 2,
          },
          {
            product: createTestProductByUtils({
              price: 20000,
              discounts: [{ quantity: 1, rate: 5000 }],
            }),
            quantity: 1,
          },
        ];
        expect(cartUtils.calculateTotalBeforeDiscount(cart)).toBe(40000);
      });
    });

  });
  });
