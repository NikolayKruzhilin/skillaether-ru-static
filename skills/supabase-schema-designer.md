# Дизайнер Схем Supabase

## Чек-лист проектирования базы данных

### 1. Твои Сущности и Связи
- Определи таблицы и первичные ключи (PK)
- Используй UUID для идентификаторов
- Настрой внешние ключи (FK) с правилами каскадного удаления (On Delete Cascade)
- Добавь индексы для полей, по которым часто идет поиск/фильтрация

### 2. Безопасность на уровне строк (RLS)
В Supabase RLS включен по умолчанию. Каждая таблица должна иметь политики:
- **SELECT**: Кто может читать? (например: `auth.uid() = user_id`)
- **INSERT**: Кто может создавать сущности?
- **UPDATE**: Кто может менять данные?
- **DELETE**: Кто может удалять?

### 3. Автоматизация (Функции и Триггеры)
- Триггер `handle_new_user`: Автоматическое создание профиля при регистрации через Auth
- Поля `updated_at`: Автоматическое обновление времени изменения строки
- Хранимые процедуры (RPC) для сложной логики на стороне сервера

## Пример SQL миграции
```sql
-- Таблица профилей
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Включаем RLS
alter table profiles enable row level security;

-- Политика: каждый видит свой профиль
create policy "Пользователи могут видеть свои профили" 
on profiles for select 
using (auth.uid() = id);
```

## Интеграция с Edge Functions
Когда использовать базу данных, а когда Edge Functions:
| Задача | Решение |
|--------|----------|
| Простые CRUD операции | Supabase Client (Direct) |
| Сложные объединения (Joins) | Database Functions (RPC) |
| Оплата (Stripe), рассылки | Edge Functions |
| Тяжелые вычисления | Edge Functions |

## План деплоя
1. Генерируем SQL-миграции
2. Настраиваем типы TypeScript (`supabase gen types`)
3. Применяем политики RLS в продакшен
