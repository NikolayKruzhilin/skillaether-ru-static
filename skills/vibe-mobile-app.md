# Vibe Mobile App

## Твой Стек
```
Expo SDK 51           — фреймворк + нативные модули
Expo Router v3        — файловая навигация
NativeWind v4         — Tailwind для React Native
Zustand               — стейт-менеджмент
Supabase              — авторизация + база данных
Expo Updates          — обновления 'по воздуху' (в обход проверки Apple)
```

## Инициализация проекта
```bash
npx create-expo-app my-app --template blank-typescript
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install nativewind zustand @supabase/supabase-js
```

## Структура файлов (Expo Router)
```
app/
  (auth)/
    login.tsx
    signup.tsx
  (tabs)/
    index.tsx       — Главная
    explore.tsx     — Поиск/Обзор
    profile.tsx     — Профиль
  _layout.tsx       — Корневой макет + защита роутов
components/
lib/
  supabase.ts
store/
  useAuthStore.ts
```

## Паттерн Навигации
```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {
  const { session } = useAuthStore();
  return (
    <Stack>
      {!session ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
```

## План Спринта на выходные
**Суббота Утро**: Инициализация, настройка навигации, экраны авторизации
**Суббота Вечер**: Экраны основной фичи + интеграция с Supabase
**Воскресенье Утро**: Тюнинг UI, краевые случаи, пуш-уведомления
**Воскресенье Вечер**: Сборка через EAS, загрузка в TestFlight

## Подача в App Store
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios  # загрузка в App Store Connect
eas submit --platform ios
```

## OTA Updates (фикс багов без ревью Apple)
```bash
npx expo publish  # обновляет JS-код моментально у всех юзеров
```
