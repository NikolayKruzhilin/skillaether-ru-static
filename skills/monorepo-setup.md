# Настройка Монорепозитория (Turborepo)

## Структура папок
```
my-monorepo/
  apps/
    web/          — Приложение на Next.js
    docs/         — Сайт с документацией
  packages/
    ui/           — Общие React-компоненты
    utils/        — Общие утилиты
    config/       — Общие конфиги TS, ESLint, Tailwind
  turbo.json
  package.json    — корень (workspaces)
```

## Корневой package.json
```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test"
  }
}
```

## turbo.json
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] },
    "test": { "outputs": [] }
  }
}
```

## Паттерн общего пакета (@repo)
```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "exports": { "./*": "./src/*.tsx" },
  "scripts": { "build": "tsc" }
}
```
```json
// apps/web/package.json — использование
{ "dependencies": { "@repo/ui": "*" } }
```

## Удаленный кэш (Vercel Remote Cache)
```bash
npx turbo login
npx turbo link
# Все запуски в CI делят один кэш — сборки ускоряются в 10 раз
```

## GitHub Actions CI
```yaml
- name: Build
  run: npx turbo build --filter=...[origin/main]
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```
