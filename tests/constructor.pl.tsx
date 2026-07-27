import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера с HAR', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/har/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');

    const ingredients = page.getByTestId('ingredients-section');
    await expect(ingredients).toBeVisible();
  });

  test('Проверяем добавление булки в конструктор', async ({ page }) => {
    const card = page.locator('[data-testid="ingredient-card"]', {
      hasText: 'Краторная булка'
    });
    const addBunButton = card.getByRole('button', { name: 'Добавить' });
    await addBunButton.click();

    const bunInConstructor = page.locator('[data-testid="constructor-bun"]', {
      hasText: 'Краторная булка'
    });
    await expect(bunInConstructor).toHaveCount(2);
  });

  test('Проверяем добавление начинки в конструктор', async ({ page }) => {
    const card = page.locator('[data-testid="ingredient-card"]', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const addMainButton = card.getByRole('button', { name: 'Добавить' });
    await addMainButton.click();

    const mainInConstructor = page.locator(
      '[data-testid="constructor-ingredient"]',
      {
        hasText: 'Биокотлета из марсианской Магнолии'
      }
    );
    await expect(mainInConstructor).toBeVisible();
  });

  test('Проверяем работу модальных окон', async ({ page }) => {
    const card = page.locator('[data-testid="ingredient-card"]', {
      hasText: 'Краторная булка'
    });
    await card.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка');

    const modalClose = page.getByTestId('modal-close');
    await modalClose.click();
    await expect(modal).not.toBeVisible();

    await card.click();
    await expect(modal).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(modal).not.toBeVisible({ timeout: 10000 });
  });

  test('Проверяем cоздание заказа', async ({ page, context }) => {
    await page.routeFromHAR('./tests/har/user.har', {
      url: '**/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/har/order.har', {
      url: '**/orders',
      update: false
    });

    // Подставляются моковые токены авторизации.
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-token');
    });
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.reload();

    const ingredients = page.getByTestId('ingredients-section');
    await expect(ingredients).toBeVisible();

    // Собирается бургер.
    const bunCard = page.locator('[data-testid="ingredient-card"]', {
      hasText: 'Краторная булка'
    });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-bun')).toHaveCount(2);

    const mainCard = page.locator('[data-testid="ingredient-card"]', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(1);

    // Вызывается клик по кнопке «Оформить заказ».

    const orderButton = page.getByTestId('order-button');
    await orderButton.click();

    const orderNumberModal = page.getByTestId('order-number');
    await expect(orderNumberModal).toBeVisible({ timeout: 15000 });
    await expect(orderNumberModal).toContainText('108495');

    // Проверяется, что конструктор пуст.
    await expect(page.getByTestId('constructor-bun')).toHaveCount(0, {
      timeout: 10000
    });
    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(0, {
      timeout: 10000
    });

    // Закрывается модальное окно и проверяется успешность закрытия.
    const closeButton = page.locator('[data-testid="modal-close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(orderNumberModal).toBeHidden({ timeout: 5000 });
    }
  });
});
