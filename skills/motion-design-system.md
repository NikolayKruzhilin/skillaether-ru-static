# Motion Design System

## Принципы Движения (Motion Principles)
Выбери 3 прилагательных, описывающих ощущение от продукта:
Пример: **Точный. Отзывчивый. Спокойный.**

Они должны определять каждое решение по анимации.

## Токены длительности (Duration)
```css
:root {
  --duration-instant:  50ms;  /* микро-фидбек: нажатие кнопки */
  --duration-fast:    150ms;  /* малые правки UI: توгл, ховер */
  --duration-normal:  250ms;  /* стандартные переходы: шторки, модалки */
  --duration-slow:    400ms;  /* большие смены макета: переходы между страницами */
  --duration-xslow:  600ms;  /* акценты: анимации на первом экране, онбординг */
}
```

## Токены сглаживания (Easing)
```css
:root {
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);  /* для большинства элементов */
  --ease-enter:     cubic-bezier(0, 0, 0.2, 1);     /* для появления элементов */
  --ease-exit:      cubic-bezier(0.4, 0, 1, 1);     /* для исчезновения элементов */
  --ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1); /* игривая обратная связь */
}
```

## Паттерны анимации компонентов

### Модальное окно / Шторка
```
Вход: fade-in (opacity 0→1) + slide-up (y 8px→0), 250ms ease-enter
Выход: fade-out + slide-down, 200ms ease-exit
```

### Тост / Уведомление
```
Вход: slide-in справа + fade-in, 300ms ease-bounce
Выход: fade-out, 200ms ease-exit
```

### Варианты Framer Motion
```tsx
const modalVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0, 0, 0.2, 1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};
```

## Адаптация (Reduced Motion — нужно по WCAG 2.1 AA)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 12 принципов анимации в UI
- **Сжатие и растяжение (Squash & Stretch)**: Легкое изменение масштаба при клике (0.97)
- **Ожидание (Anticipation)**: Незначительная задержка перед загрузкой контента модалки
- **Плавность (Ease In/Out)**: Никогда не используй линейную (linear) анимацию в UI
