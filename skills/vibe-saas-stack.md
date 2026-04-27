# Vibe SaaS Stack

## Твой Стек
```
Next.js 14 (App Router)    — фреймворк
Supabase                   — база данных + хранилище
Clerk                      — авторизация (соцсети, 2FA, организации)
Stripe                     — подписки + разовые платежи
Tailwind + shadcn/ui       — интерфейс
Vercel                     — деплой
```
Общее время настройки: ~30 минут.
Стоимость при нуле пользователей: ~$0/мес.

## Структура файлов
```
app/
  (auth)/              — страницы входа/регистрации (Clerk)
  (dashboard)/         — защищенные роуты
    dashboard/         — главная страница приложения
    settings/          — настройки профиля + биллинг
  api/
    webhooks/stripe/   — обработчик вебхуков Stripe
lib/
  supabase.ts          — клиент Supabase
  stripe.ts            — клиент Stripe + конфиг тарифов
components/
  ui/                  — компоненты shadcn
  billing/             — таблицы цен, модалки апгрейда
```

## Паттерн авторизации (Clerk)
```typescript
// middleware.ts — защищаем все роуты дашборда
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/dashboard(.*)']);
export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) auth().protect();
});
```

## Паттерн подписок Stripe
```typescript
// Создание сессии чекаута
const session = await stripe.checkout.sessions.create({
  customer_email: user.emailAddresses[0].emailAddress,
  mode: 'subscription',
  line_items: [{ price: PRICE_ID, quantity: 1 }],
  success_url: `${BASE_URL}/dashboard?upgraded=true`,
  cancel_url: `${BASE_URL}/pricing`,
  metadata: { userId: user.id },
});
```

## Supabase RLS для мульти-тенантности
```sql
-- Пользователи видят только свои данные
create policy "свои данные" on user_data
  using (user_id = requesting_user_id());
```

## Чек-лист перед запуском
- [ ] Эндпоинт вебхуков Stripe в проде + секрет настроен
- [ ] Supabase RLS включен на всех таблицах
- [ ] Clerk переведен в продакшен режим (не dev)
- [ ] Привязан кастомный домен на Vercel
- [ ] Включен мониторинг ошибок (бесплатный план Sentry)
