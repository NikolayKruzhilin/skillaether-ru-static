# Билдер Telegram-ботов (aiogram 3.x)

## Твой Стек
```
Python 3.12+           — язык программирования
aiogram 3.x            — современный асинхронный фреймворк
PostgreSQL + SQLAlchemy — база данных
Redis                  — хранилище состояний (FSM) и кэш
Docker                 — контейнеризация и деплой
```

## Архитектура Handler-ов
```python
from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command

router = Router()

@router.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        f"Привет, {message.from_user.full_name}! 👋\n"
        "Я твой ИИ-ассистент. Чем могу помочь?"
    )

@router.message(F.text == "Оформить подписку")
async def process_subscription(message: Message):
    # Логика оплаты через Telegram Payments
    pass
```

## Интеграция с ИИ (OpenAI/GigaChat/YandexGPT)
```python
async def get_ai_response(text: str) -> str:
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": text}]
    )
    return response.choices[0].message.content
```

## Управление Состояниями (FSM)
```python
class Form(StatesGroup):
    name = State()
    age = State()
    preferences = State()

# Позволяет вести пользователя по шагам анкеты или заказа
```

## План запуска бота
1. Регистрация у `@BotFather` и получение токена.
2. Настройка `config.py` с переменными окружения через `pydantic-settings`.
3. Создание Docker-образа.
4. Деплой на VPS (например, Amvera, Timeweb или Selectel).
5. Настройка вебхуков (webhooks) для работы под нагрузкой.

## Что ты получишь на выходе
- Масштабируемую структуру проекта (handlers, middlewares, services, models).
- Интеграцию с платежными шлюзами (ЮKassa, Stripe).
- Систему логирования и обработки ошибок.
- Готовый `Dockerfile` и `docker-compose.yml`.
