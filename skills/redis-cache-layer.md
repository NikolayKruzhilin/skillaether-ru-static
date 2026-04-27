# Слой Кэширования Redis

## Паттерн Cache-Aside (самый популярный)
```typescript
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  if (user) await redis.setex(`user:${id}`, 300, JSON.stringify(user)); // TTL 5 минут
  return user;
}

async function updateUser(id: string, data: Partial<User>) {
  const user = await db.user.update({ where: { id }, data });
  await redis.del(`user:${id}`); // инвалидация при обновлении
  return user;
}
```

## Предотвращение Кэш-шторма (Stampede)
```typescript
async function getCachedOrCompute(key: string, compute: () => Promise<any>, ttl = 300) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Распределенная блокировка — только один запрос вычисляет данные
  const lock = await redis.set(`lock:${key}`, '1', 'EX', 10, 'NX');
  if (!lock) {
    await new Promise(r => setTimeout(r, 100));
    return getCachedOrCompute(key, compute, ttl); // пробуем снова
  }

  const result = await compute();
  await redis.setex(key, ttl, JSON.stringify(result));
  await redis.del(`lock:${key}`);
  return result;
}
```

## Гид по стратегиям TTL
| Тип данных | TTL |
|-----------|-----|
| Профиль пользователя | 5–15 мин |
| Публичный контент | 1–24 часа |
| Сессии | 24 часа |
| Лимиты запросов (Rate limit) | 1 мин |
| Результаты поиска | 5 мин |
| Агрегации / Статистика | 1 час |

## Паттерны инвалидации
- По ключу: `DEL user:123`
- По паттерну: `redis.eval("...", ["user:*"])` (используй осторожно)
- По тегам: сохрани маппинг тег→ключи, удаляй по тегу

## Настройка клиента Redis (ioredis)
```typescript
import Redis from 'ioredis';
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
});
```
