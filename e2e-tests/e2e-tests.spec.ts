import test, { expect } from '@playwright/test';
import { exec } from 'child_process';

let serverProcess;

test.beforeAll(async () => {
  serverProcess = exec('pnpm start:refactoring');
});

test('사용자에게 웹서비스가 정상적으로 로드 되어야한다.', async ({ page }) => {
  await page.goto('http://localhost:5173/index.refactoring.html');
  await expect(page).toHaveURL('http://localhost:5173/index.refactoring.html');
});

test('사용자가 장바구니에 상품을 추가하고 쿠폰을 적용하여 최종 결제 금액을 확인할 수 있어야 한다.', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/index.refactoring.html');
  await expect(page).toHaveURL('http://localhost:5173/index.refactoring.html');

  await page.locator('[data-testid="product-p1"] button', { hasText: '장바구니에 추가' }).click();

  await page.locator('select[name="coupon-select"]').selectOption({ value: '0' });

  await expect(page.locator('text=최종 결제 금액: 5,000원')).toHaveText('최종 결제 금액: 5,000원');
});

test('사용자가 장바구니에서 상품 수량을 조절하고 상품을 삭제하여 최종 결제 금액이 정확하게 반영되는지 확인한다.', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/index.refactoring.html');

  await page.locator('[data-testid="product-p1"] button', { hasText: '장바구니에 추가' }).click();

  const plusButton = page.locator('button', { hasText: '+' });
  await plusButton.click();
  await plusButton.click();

  await expect(page.locator('text=최종 결제 금액: 30,000원')).toHaveText(
    '최종 결제 금액: 30,000원'
  );

  const minusButton = page.locator('button', { hasText: '-' });
  await minusButton.click();

  await expect(page.locator('text=최종 결제 금액: 20,000원')).toHaveText(
    '최종 결제 금액: 20,000원'
  );

  const deleteButton = page.locator('button', { hasText: '삭제' });
  await deleteButton.click();

  await expect(page.locator('text=최종 결제 금액: 0원')).toHaveText('최종 결제 금액: 0원');
});

test('관리자가 새로운 상품을 추가하면 상품 목록에 해당 상품이 정상적으로 표시되어야 한다.', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/index.refactoring.html');
  await page.locator('button', { hasText: '관리자 페이지로' }).click();
  await page.locator('button', { hasText: '새 상품 추가' }).click();
  await page.locator('#productName').fill('테스트 상품 1');
  await page.locator('#productPrice').fill('20000');
  await page.locator('#productStock').fill('8');
  await page.locator('button.bg-blue-500:has-text("추가")').click();

  await expect(page.locator('text=테스트 상품 1 - 20000원 (재고: 8')).toBeVisible();
});

test('관리자가 새 쿠폰을 등록하면 쿠폰 목록에 쿠폰이 정상적으로 표시되어야 한다.', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/index.refactoring.html');
  await page.locator('button', { hasText: '관리자 페이지로' }).click();

  await page.locator('input[placeholder="쿠폰 이름"]').fill('1000원 할인 쿠폰');
  await page.locator('input[placeholder="쿠폰 코드"]').fill('AMOUNT1000');
  await page.locator('select').selectOption('amount');
  await page.locator('input[placeholder="할인 값"]').fill('1000');
  await page.locator('button', { hasText: '쿠폰 추가' }).click();

  await expect(page.locator('data-testid=coupon-3')).toHaveText(
    '1000원 할인 쿠폰 (AMOUNT1000):1000원 할인'
  );
});

test('관리자가 등록한 새 쿠폰을 장바구니 페이지에서 적용할 때 쿠폰에 따른 할인이 정확하게 반영되어야 한다.', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/index.refactoring.html');
  await page.locator('button', { hasText: '관리자 페이지로' }).click();

  await page.locator('input[placeholder="쿠폰 이름"]').fill('1000원 할인 쿠폰');
  await page.locator('input[placeholder="쿠폰 코드"]').fill('AMOUNT1000');
  await page.locator('select').selectOption({ label: '금액(원)' });
  await page.locator('input[placeholder="할인 값"]').fill('1000');
  await page.locator('button', { hasText: '쿠폰 추가' }).click();

  await expect(page.locator('[data-testid="coupon-3"]')).toHaveText(
    '1000원 할인 쿠폰 (AMOUNT1000):1000원 할인'
  );

  await page.locator('button', { hasText: '장바구니 페이지로' }).click();
  await page.locator('[data-testid="product-p1"] button', { hasText: '장바구니에 추가' }).click();
  await page.locator('select[name="coupon-select"]').selectOption({ index: 2 });

  await expect(page.locator('text=최종 결제 금액: 9,000원')).toBeVisible();
});
