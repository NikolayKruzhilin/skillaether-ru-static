# Интегратор Вебхуков

## 4 Закона Вебхуков
1. Всегда проверяй подпись (Signature)
2. Сразу отвечай '200 OK', обрабатывай асинхронно
3. Делай обработчики идемпотентными (защита от повторов)
4. Сохраняй событие в БД перед обработкой

## Верификация подписи (Пример со Stripe)
```typescript
import Stripe from 'stripe';
export async function POST(req: Request) {
  const body = await req.text(); // нужен 'сырой' body
  const sig = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Неверная подпись', { status: 400 });
  }
  await queue.add(event); // асинхронная обработка через очередь
  return new Response('ok');
}
```

## Паттерн Идемпотентности
```typescript
async function handleEvent(event: WebhookEvent) {
  const exists = await db.processedEvents.findUnique({ where: { eventId: event.id } });
  if (exists) return; // уже обработано ранее
  
  await db.$transaction([
    db.processedEvents.create({ data: { eventId: event.id } }),
    processBusinessLogic(event)
  ]);
}
```

## Повторы и Dead Letter Queue (DLQ)
```typescript
// Пример на BullMQ
const webhookQueue = new Queue('webhooks');
const worker = new Worker('webhooks', processEvent, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
});
worker.on('failed', async (job) => {
  if (job.attemptsMade === 5) await deadLetterQueue.add(job.data); // в очередь 'смертников' для ручного разбора
});
```

## Локальное тестирование
```bash
# Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# ngrok
ngrok http 3000
```
