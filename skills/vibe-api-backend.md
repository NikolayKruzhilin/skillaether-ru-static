# Vibe API Backend

## Твой Стек
```
Bun        — рантайм (быстрее Node.js)
Hono       — ультралегкий фреймворк (Express нового поколения)
Supabase   — база данных PostgreSQL
Railway    — деплой в один клик
```

## Инициализация проекта
```bash
bun init -y
bun add hono @supabase/supabase-js
```

## index.ts — Твой API за 10 строк
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/*', cors()); // разрешаем запросы со всех фронтендов

app.get('/', (c) => c.text('Vibe API is live! 🚀'));

app.get('/skills/:slug', async (c) => {
  const slug = c.req.param('slug');
  const { data } = await supabase.from('skills').select('*').eq('slug', slug).single();
  return c.json(data);
});

export default app;
```

## Паттерн авторизации (JWT)
```typescript
import { verify } from 'hono/jwt';

app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  const payload = await verify(token, process.env.JWT_SECRET!);
  c.set('jwtPayload', payload);
  await next();
});
```

## План деплоя (Railway)
1. Создай новый проект на Railway → GitHub Repo
2. Добавь переменную окружения `PORT=3000`
3. Railway сам обнаружит `bun` и запустит сервер
4. Готово! У тебя есть публичный URL бэкенда.

## Почему Hono?
- Работает везде (Bun, Node, Cloudflare Workers, Deno)
- Быстрее Express в 5-10 раз
- Идеальная поддержка TypeScript 'из коробки'
- Минимальный размер бандла
