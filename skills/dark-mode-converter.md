# Дизайн-система Темной Темы (Dark Mode)

## Базовый Принцип
Тёмная тема — это НЕ: "инвертировать все цвета".
Тёмная тема — это: отдельная система цветов поверхностей, в которой показатель элевации (высоты) = светлоте цвета.

## Шкала Элевации Поверхностей (dark)
```
Фон (Background base):       #0A0A0A (z=0)
Поверхность (Surface):       #141414 (z=1 — карточки, панели)
Приподнято (Surface raised): #1E1E1E (z=2 — дропдауны, модалки)
Оверлей (Surface overlay):   #282828 (z=3 — тултипы, поповеры)
Граница мягкая (subtle):     #2A2A2A
Граница дефолтная:           #3D3D3D
```

## Система Семантических Токенов
```css
/* Светлая тема */
:root {
  --color-bg:           #FFFFFF;
  --color-surface:      #F9FAFB;
  --color-text:         #111827;
  --color-text-muted:   #6B7280;
  --color-border:       #E5E7EB;
  --color-primary:      #6C5CE7;
  --color-primary-text: #FFFFFF;
}

/* Темная тема */
[data-theme="dark"] {
  --color-bg:           #0A0A0A;
  --color-surface:      #141414;
  --color-text:         #F5F5F5;
  --color-text-muted:   #A1A1AA;
  --color-border:       #2A2A2A;
  --color-primary:      #7C6EF5; /* слегка светлее для контраста */
  --color-primary-text: #FFFFFF;
}
```

## Конфиг Tailwind
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // или 'media'
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
      }
    }
  }
}
```

## Имплементация Переключателя
```tsx
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <button onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>;
}
```

## Подводные камни Темной Темы
- Тени в темноте не работают — вместо них используй осветление поверхности (элевация через цвет)
- Изображения: добавляй `filter: brightness(0.9)` для мягкого приглушения свечения
- Избегай чистого черного (#000) — используй #0A0A0A или #0D0D0D
- Контрастность: тексту на темном фоне нужен коэффициент 4.5:1 (по стандарту WCAG AA)
