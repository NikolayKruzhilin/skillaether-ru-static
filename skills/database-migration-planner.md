# Планировщик БД-Миграций

## Паттерн Expand-Contract
Самый безопасный способ изменить колонку без простоя (downtime):

### Шаг 1: Expand (добавь новое)
```sql
ALTER TABLE users ADD COLUMN full_name TEXT;
```
Задеплой код, который пишет ОДНОВРЕМЕННО и в старую, и в новую колонку.

### Шаг 2: Backfill (заполнение данных)
```sql
-- Заполняй данные батчами, чтобы избежать эскалации блокировок
DO $$
DECLARE batch_size INT := 1000;
        last_id BIGINT := 0;
BEGIN
  LOOP
    UPDATE users SET full_name = first_name || ' ' || last_name
    WHERE id > last_id AND full_name IS NULL
    ORDER BY id LIMIT batch_size RETURNING id INTO last_id;
    EXIT WHEN NOT FOUND;
    PERFORM pg_sleep(0.01); -- будь добр к проду
  END LOOP;
END;
$$;
```

### Шаг 3: Добавь ограничения (constraints)
```sql
-- Используй NOT VALID, чтобы избежать полного секвенциального сканирования
ALTER TABLE users ADD CONSTRAINT users_full_name_not_null CHECK (full_name IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT users_full_name_not_null; -- работает в фоне
```

### Шаг 4: Contract (удали старое)
Задеплой код, который читает только из новой колонки, затем:
```sql
ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;
```

## Создание индексов (без блокировки)
```sql
-- Всегда используй CONCURRENTLY — никогда не блокируй прод
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

## Чек-лист миграции для Prisma
- [ ] `prisma migrate dev` протестировано локально
- [ ] Миграция проверена на риск блокировок (lock risk)
- [ ] Написан скрипт бэкфилла (backfill) для изменений типа non-null
- [ ] Написан и протестирован скрипт отката (rollback)
- [ ] Примерное время миграции оценено с учетом размера данных на продакшене
