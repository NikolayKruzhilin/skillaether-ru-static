# Экстрактор Данных из PDF

## Выбор Инструмента
| Тип PDF | Лучший инструмент |
|----------|----------|
| Текстовый PDF | PyPDF2 / pdfplumber |
| Скан или фото PDF | GPT-4 Vision или AWS Textract |
| Сложные таблицы | LlamaParse или Camelot |
| Инвойсы / чеки | GPT-4 Vision + схема (Pydantic) |

## Подход через GPT-4 Vision
```python
import base64, json
from openai import OpenAI
from pdf2image import convert_from_path

def extract_invoice(pdf_path: str) -> dict:
    images = convert_from_path(pdf_path)
    client = OpenAI()

    pages_content = []
    for img in images:
        # Конвертация в base64
        import io
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        b64 = base64.b64encode(buf.getvalue()).decode()

        response = client.chat.completions.create(
            model='gpt-4o',
            messages=[{
                'role': 'user',
                'content': [
                    {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}},
                    {'type': 'text', 'text': 'Извлеки: vendor_name, invoice_number, date, total_amount, line_items. Верни только JSON.'}
                ]
            }]
        )
        pages_content.append(json.loads(response.choices[0].message.content))
    return pages_content[0]  # или логика слияния страниц
```

## Использование pdfplumber для таблиц
```python
import pdfplumber

with pdfplumber.open('report.pdf') as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            # table — это список строк (список строк)
            headers = table[0]
            rows = table[1:]
```

## Валидация по Схеме
```python
from pydantic import BaseModel, validator

class Invoice(BaseModel):
    vendor_name: str
    invoice_number: str
    total_amount: float
    line_items: list[dict]

    @validator('total_amount')
    def amount_positive(cls, v):
        assert v > 0, 'Сумма должна быть положительной'
        return v

invoice = Invoice(**extracted_data)  # упадет с ошибкой при невалидных данных
```
