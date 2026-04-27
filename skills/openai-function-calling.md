# OpenAI Function Calling

## Основной паттерн
```python
from openai import OpenAI
client = OpenAI()

tools = [{
  "type": "function",
  "function": {
    "name": "extract_data",
    "description": "Извлечение структурированных данных из текста",
    "parameters": {
      "type": "object",
      "properties": {
        "company_name": {"type": "string"},
        "revenue": {"type": "number", "description": "Годовая выручка в USD"},
        "employees": {"type": "integer"}
      },
      "required": ["company_name"]
    }
  }
}]

response = client.chat.completions.create(
  model="gpt-4o",
  messages=[{"role": "user", "content": text}],
  tools=tools,
  tool_choice={"type": "function", "function": {"name": "extract_data"}}
)

result = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
```

## Режим Structured Output (новый, предпочтительный)
```python
from pydantic import BaseModel

class Company(BaseModel):
    name: str
    revenue: float | None
    employees: int | None

completion = client.beta.chat.completions.parse(
  model="gpt-4o-2024-08-06",
  messages=[{"role": "user", "content": text}],
  response_format=Company
)
company = completion.choices[0].message.parsed  # типизированный объект Company
```

## Параллельные вызовы инструментов
GPT-4 может вызывать несколько функций в одном ответе.
Всегда обрабатывай `tool_calls` как список:
```python
for tool_call in response.choices[0].message.tool_calls:
    name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)
    result = dispatch_tool(name, args)
```

## Советы по написанию схем
- Используй `description` для КAЖДОГО поля — ИИ читает их для понимания контекста
- Используй `enum` для полей с фиксированным набором значений
- Не делай все поля обязательными (required), если это не так
- Держи схемы плоскими — вложенные объекты чаще путают модель
