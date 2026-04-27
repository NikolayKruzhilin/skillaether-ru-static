# Автор Тестов Playwright

## Приоритет Селекторов (от самых надежных к хрупким)
1. `getByRole` — семантически верно, завязано на доступность
2. `getByLabel` / `getByPlaceholder` — для элементов форм
3. `getByText` — стабильный текст интерфейса
4. `data-testid` — явные хуки для тестов
5. CSS селекторы — крайний случай, так как они слишком хрупкие

## Page Object Model (POM)
```typescript
// pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Войти' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('/dashboard');
  }
}
```

## Переиспользование Авторизации (огромный выигрыш в скорости)
```typescript
// global-setup.ts
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('/login');
  await new LoginPage(page).login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}
// playwright.config.ts
projects: [{ use: { storageState: 'playwright/.auth/user.json' } }]
```

## Мокинг Сетевых Запросов
```typescript
await page.route('**/api/users', async route => {
  await route.fulfill({ json: [{ id: '1', name: 'Test User' }] });
});
```

## Правила борьбы с флеками (Flakiness)
- Никогда не используй `page.waitForTimeout()` — жди конкретный элемент или сеть
- Используй `waitFor: 'networkidle'` только в крайнем случае для SPA
- Добавляй ретраи (retry) для утверждений: `expect(locator).toBeVisible({ timeout: 10_000 })`
- Изолируй тесты: каждый тест должен создавать свои собственные данные
