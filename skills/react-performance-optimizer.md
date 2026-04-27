# Оптимизатор Производительности React

## Шаг 1: Сначала Профилируй
Открой React DevTools → вкладка Profiler → Record → соверши действия → Stop.
Ищи:
- Компоненты, которые рендерятся чаще ожидаемого
- Долгие времена коммитов (> 16мс = пропуск кадра)
- Ре-рендеры компонентов, у которых не менялись пропсы

## Шаг 2: Устранение причин лишних ре-рендеров

### Нестабильные пропсы (объекты/массивы)
```tsx
// Плохо — новый объект на каждом рендере
<Component style={{ color: 'red' }} />

// Хорошо — стабильная ссылка
const style = useMemo(() => ({ color: 'red' }), []);
<Component style={style} />
```

### Нестабильные колбэки
```tsx
// Плохо
<Button onClick={() => handleClick(id)} />

// Хорошо
const onClick = useCallback(() => handleClick(id), [id]);
<Button onClick={onClick} />
```

### Мемоизация тяжелых компонентов
```tsx
const HeavyList = memo(({ items }: Props) => {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});
```

## Шаг 3: Разделение Контекста (Context Splitting)
```tsx
// Плохо — всё рендерится при смене темы ИЛИ авторизации
const AppContext = createContext({ user, theme, cart });

// Хорошо — раздельные контексты
const AuthContext = createContext(user);
const ThemeContext = createContext(theme);
const CartContext = createContext(cart);
```

## Шаг 4: Разделение кода (Code Splitting)
```tsx
const Dashboard = lazy(() => import('./Dashboard'));
// Оберни в <Suspense fallback={<Spinner />}>
```

## Шаг 5: Виртуализация длинных списков
Используй `@tanstack/react-virtual` для списков более 100 элементов.

## Бюджет производительности
- First Contentful Paint < 1.8с
- Time to Interactive < 3.8с
- Никакой компонент не рендерится > 3 раз на одно действие пользователя
