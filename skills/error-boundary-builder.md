# Билдер Error Boundary

## Компонент React Error Boundary
```tsx
'use client';
import { Component, type ReactNode } from 'react';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <ErrorFallback error={this.state.error} />;
    return this.props.children;
  }
}
```

## UI Запасного интерфейса (Fallback)
```tsx
function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div role="alert" className="p-6 border border-red-200 rounded-lg">
      <h2 className="font-semibold text-red-700">Что-то пошло не так</h2>
      <p className="text-sm text-gray-600 mt-1">{error?.message}</p>
      <button onClick={() => window.location.reload()} className="mt-3 text-sm underline">
        Попробовать снова
      </button>
    </div>
  );
}
```

## Нормализация ошибок API
```typescript
class AppError extends Error {
  constructor(public code: string, message: string, public statusCode = 500) {
    super(message);
  }
}

async function fetchWithErrors<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new AppError(body.code ?? 'UNKNOWN', body.message ?? 'Запрос не удался', res.status);
  }
  return res.json();
}
```

## Обогащение контекста Sentry
```typescript
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setTag('feature', 'checkout');
Sentry.addBreadcrumb({ message: 'Пользователь нажал оплатить', category: 'ui', level: 'info' });
```
