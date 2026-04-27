# Билдер Агентов LangChain

## Матрица выбора Архитектуры
| Кейс | Паттерн |
|----------|---------|
| Простой Q&A | LLMChain |
| Работа с инструментами | ReAct Agent |
| Многошаговые рассуждения | LangGraph |
| QA по документам | RAG Chain |
| Параллельные задачи | Map-Reduce Chain |

## Паттерн описания Инструмента (Tool)
```python
from langchain.tools import tool

@tool
def search_database(query: str) -> str:
    """Поиск в базе данных продуктов по запросу.
    Используй это, когда пользователь спрашивает о конкретных товарах или остатках на складе."""
    # реализация
    return results
```

Правило: Докстринг инструмента — ЭТО И ЕСТЬ инструкция для промпта. Пиши его максимально четко.

## Паттерны Памяти
- ConversationBufferMemory — полная история, для коротких сессий
- ConversationSummaryMemory — саммаризацию старых ходов, для долгих сессий
- VectorStoreMemory — семантический поиск по истории
- EntityMemory — отслеживание именованных сущностей в диалоге

## Паттерн Парсера вывода (Output Parser)
Всегда определяй схему ожидаемого ответа заранее:
```python
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel

class AnalysisResult(BaseModel):
    sentiment: str
    confidence: float
    key_points: list[str]

parser = PydanticOutputParser(pydantic_object=AnalysisResult)
```

## Обработка ошибок в Продакшене
- Ставь max_iterations на агентах (для защиты от бесконечных циклов)
- Добавляй запасные цепочки (fallback chains) на случай ошибок парсинга
- Логируй все вызовы LLM с подсчетом токенов
- Внедряй 'предохранитель' (circuit breaker) для внешних инструментов
