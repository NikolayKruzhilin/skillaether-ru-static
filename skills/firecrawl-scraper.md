# Интеграция Скрапера Firecrawl

## Настройка
```
FIRECRAWL_API_KEY=fc-твой-ключ-здесь
```

## Основные Операции

### Скрапинг одной страницы
```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

### Полный краулинг сайта
```python
crawl_result = app.crawl_url(
  'https://docs.example.com',
  params={
    'limit': 100,
    'scrapeOptions': {'formats': ['markdown']}
  }
)
```

### Массовый скрапинг (параллельный)
```python
urls = ['https://site1.com', 'https://site2.com', 'https://site3.com']
batch_result = app.batch_scrape_urls(urls, params={'formats': ['markdown', 'json']})
```

## Паттерн промпта для Агента
Когда агенту нужно изучить URL:
1. Вызови эндпоинт Firecrawl scrape
2. Передай результат в формате markdown напрямую в контекст LLM
3. Попроси LLM извлечь конкретные поля в формате JSON
4. Провалидируй схему вывода

## Работа с лимитами (Rate Limits)
- Бесплатный тариф: 500 кредитов/мес
- Добавь экспоненциальную задержку (backoff) при ошибках 429
- Кэшируй результаты локально, чтобы избежать повторного скрапинга
