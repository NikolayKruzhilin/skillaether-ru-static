# Контейнеризатор Docker

## Чек-лист Анализа
Прежде чем писать Dockerfile, определи:
1. Базовый язык и его версию (node:20, python:3.11 и т.д.)
2. Необходимые шаги сборки (компиляция, бандлинг и т.д.)
3. Зависимости времени выполнения (runtime) против зависимостей сборки
4. Необходимые переменные окружения
5. Порты, которые нужно открыть (expose)
6. Эндпоинт для проверки здоровья (health check)
7. Требования к запуску от не-root пользователя

## Шаблон Многоэтапной Сборки (Node.js)
```dockerfile
# Этап 1: Зависимости
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Этап 2: Билдер
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 3: Runner (Финальный образ)
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]
```

## Шаблон docker-compose
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s
volumes:
  postgres_data:
```
