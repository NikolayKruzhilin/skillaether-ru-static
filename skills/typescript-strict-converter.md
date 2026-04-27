# TypeScript Strict Converter

## Стратегия Миграции (3 фазы)

### Фаза 1 — Поэтапное включение strict-флагов
```json
// tsconfig.json — начни отсюда
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
// Добавляй по одному флагу на каждый PR
```

### Фаза 2 — Искоренение `any`
Паттерн поиска: `grep -rn ": any" src/`

Типичные замены:
- `any[]` → `unknown[]`, затем сужение через type guards
- `(e: any)` → `(e: Error)` или `(e: unknown)`
- Ответы API → опиши интерфейс или используй `z.infer<typeof schema>`

### Фаза 3 — Полный strict mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Частые паттерны

### Доступ к опциональным свойствам
```typescript
// До
const name = user.profile.name;
// После
const name = user.profile?.name ?? 'Anonymous';
```

### Type guard для unknown
```typescript
function isApiError(e: unknown): e is { message: string } {
  return typeof e === 'object' && e !== null && 'message' in e;
}
```

### Generic-обертка для fetch
```typescript
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
```

## Чек-лист по файлам
- [ ] Заменить все `any` на правильные типы
- [ ] Добавить типы возвращаемых значений всем экспортируемым функциям
- [ ] Защитить доступ по индексам массивов
- [ ] Обработать все ошибки Promise через типизированный catch
- [ ] Проверить все приведения типов `as` — заменить на type guards
