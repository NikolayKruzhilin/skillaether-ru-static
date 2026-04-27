# Архитектор Дизайн-Токенов

## Трехуровневая Структура Токенов

### Уровень 1: Примитивные Токены (сырые значения)
```json
{
  "color": {
    "blue": {
      "100": { "value": "#EFF6FF" },
      "500": { "value": "#3B82F6" },
      "900": { "value": "#1E3A5F" }
    }
  },
  "spacing": {
    "1": { "value": "4px" },
    "2": { "value": "8px" },
    "4": { "value": "16px" }
  }
}
```

### Уровень 2: Семантические Токены (основанные на назначении)
```json
{
  "color": {
    "background": {
      "primary": { "value": "{color.blue.500}" },
      "surface": { "value": "{color.neutral.50}" }
    },
    "text": {
      "default": { "value": "{color.neutral.900}" },
      "muted": { "value": "{color.neutral.500}" },
      "inverse": { "value": "{color.neutral.0}" }
    }
  }
}
```

### Уровень 3: Компонентные Токены (для конкретных компонентов)
```json
{
  "button": {
    "background": { "value": "{color.background.primary}" },
    "text": { "value": "{color.text.inverse}" },
    "padding-x": { "value": "{spacing.4}" }
  }
}
```

## Паттерн Темной Темы
Между темами меняются только семантические токены:
```json
[светлая тема]
"color.surface": "#FFFFFF"
"color.text.default": "#111827"

[темная тема]
"color.surface": "#1F2937"
"color.text.default": "#F9FAFB"
```
Примитивные токены никогда не меняются — переопределения (overrides) тем делаются только для семантических токенов.

## Пайплайн Синхронизации
1. Плагин Figma → Tokens Studio экспортирует токены в tokens.json
2. Утилита Style Dictionary трансформирует это в CSS переменные, iOS Swift, Android XML
3. Git коммит триггерит создание PR (Pull Request) для обновления токенов
4. Дизайн и разработка всегда синхронизированы
