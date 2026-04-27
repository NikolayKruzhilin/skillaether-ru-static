# Билдер Ботов для Slack

## Настройка (Bolt.js)
```typescript
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // для локальной разработки
  appToken: process.env.SLACK_APP_TOKEN,
});
```

## Слэш-команда (Slash Command)
```typescript
app.command('/standup', async ({ command, ack, say }) => {
  await ack();
  await say({
    text: `Стандап от <@${command.user_id}>`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*Стандап* от <@${command.user_id}>` } },
      { type: 'actions', elements: [{
        type: 'button',
        text: { type: 'plain_text', text: 'Добавить апдейт' },
        action_id: 'open_standup_modal'
      }]}
    ]
  });
});
```

## Модальное окно (Block Kit)
```typescript
app.action('open_standup_modal', async ({ ack, body, client }) => {
  await ack();
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'standup_submit',
      title: { type: 'plain_text', text: 'Daily Standup' },
      submit: { type: 'plain_text', text: 'Отправить' },
      blocks: [
        { type: 'input', block_id: 'yesterday', label: { type: 'plain_text', text: 'Что сделал вчера' },
          element: { type: 'plain_text_input', action_id: 'input', multiline: true } },
        { type: 'input', block_id: 'today', label: { type: 'plain_text', text: 'Что сделаю сегодня' },
          element: { type: 'plain_text_input', action_id: 'input', multiline: true } },
      ]
    }
  });
});
```

## Отложенное сообщение
```typescript
const result = await client.chat.scheduleMessage({
  channel: '#general',
  post_at: Math.floor(Date.now() / 1000) + 3600,
  text: 'Напоминание: еженедельный синк через час!',
});
```

## Необходимые доступы (Scopes) в Slack App
- `commands` — для работы слэш-команд
- `chat:write` — для отправки сообщений
- `users:read` — для получения информации о юзерах
- `views:open` — для открытия модальных окон
