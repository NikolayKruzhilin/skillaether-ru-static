# Midjourney Prompt Engine

## Формула Промпта
```
[Объект], [Стиль], [Освещение], [Композиция], [Цветовая палитра], [Модификаторы качества] --ar [ratio] --v 6 --q 2
```

## Словарь Стилей

### Фотография
- Портрет: `85mm lens, shallow depth of field, bokeh, golden hour`
- Предметная: `studio lighting, white background, product photography, sharp focus`
- Архитектура: `wide angle, blue hour, long exposure, HDR`

### Иллюстрация
- Чистый стиль: `flat design, minimal, vector style, clean lines`
- Эдиториал: `editorial illustration, New Yorker style, ink drawing`
- 3D: `3D render, cinema4d, octane render, subsurface scattering`

### UI/Брендинг
- Экраны приложений: `app UI design, clean interface, mobile mockup, Figma style`
- Логотип: `minimal logo, geometric, single color, vector`

## Соотношение сторон (Aspect Ratios)
- Квадрат для соцсетей: `--ar 1:1`
- Баннер Twitter/LinkedIn: `--ar 3:1`
- Instagram story: `--ar 9:16`
- YouTube thumbnail: `--ar 16:9`
- Печатный формат: `--ar 4:5`

## Параметры Качества
- Скорость: `--q .25` (в 4 раза быстрее, ниже качество)
- Баланс: `--q 1` (по умолчанию)
- Максимум: `--q 2` (в 2 раза дороже, самое высокое качество)

## Негативные промпты (--no)
Полезно почти всегда: `--no text, watermark, blurry, distorted hands, extra fingers`
