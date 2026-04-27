# API Rate Limiter

## Сравнение алгоритмов
| Алгоритм | Плюсы | Минусы |
|-----------|------|------|
| Fixed Window | Простой в реализации | Возможны скачки при сбросе окна (burst) |
| Sliding Window | Нет проблемы скачков | Расходует больше памяти |
| Token Bucket | Позволяет единовременные скачки (burst) | Более сложен в реализации |

## Sliding Window (Скользящее окно) с Redis
```typescript
async function slidingWindowLimit(key: string, limit: number, windowMs: number): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  await redis
    .multi()
    .zremrangebyscore(key, 0, windowStart)  // удали старые записи
    .zadd(key, now, `${now}-${Math.random()}`)  // добавь текущий запрос
    .expire(key, Math.ceil(windowMs / 1000))
    .exec();

  const count = await redis.zcard(key);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
```

## Middleware для Next.js
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const key = `rate:${ip}:${req.nextUrl.pathname}`;
  const { allowed, remaining } = await slidingWindowLimit(key, 100, 60_000);

  if (!allowed) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' },
    });
  }
  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  return res;
}
```

## Лимиты на конкретного пользователя
```typescript
// Разные лимиты для авторизованных и анонимных пользователей
const limit = userId ? 1000 : 100;
const key = userId ? `rate:user:${userId}` : `rate:ip:${ip}`;
```

## Белый список (Bypass List)
```typescript
const BYPASS_IPS = new Set(process.env.RATE_LIMIT_BYPASS?.split(',') ?? []);
if (BYPASS_IPS.has(ip)) return NextResponse.next();
```
