# Проектировщик CI/CD Пайплайнов

## Стадии Пайплайна (по порядку)
1. Линтинг и Проверка типов (падай быстро, дешево)
2. Юнит Тесты (параллельно)
3. Интеграционные Тесты
4. Сканирование безопасности (Trivy/Snyk)
5. Сборка и Пуш Образа
6. Деплой в Preview-окружение
7. E2E Тесты в Preview
8. Деплой в Продакшн
9. Smoke-тесты на Продакшене
10. Откат при ошибке

## Шаблон GitHub Actions
```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ${{ env.IMAGE }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          # команда деплоя
      - name: Smoke test
        run: curl -f https://your-app.com/health
```

## Стратегия отката (Rollback)
- Помечай каждый продакшн-образ хэшем гита (git SHA)
- Храни последние 5 успешных сборок в реестре
- Откат одной командой: передеплой предыдущего SHA
