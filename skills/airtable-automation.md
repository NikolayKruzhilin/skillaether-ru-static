# Билдер автоматизаций Airtable

## Scripting API (Скрипты внутри базы)
```javascript
// Массово обнови записи по условию
const table = base.getTable('Projects');
const query = await table.selectRecordsAsync({ fields: ['Status', 'Due Date'] });

const overdue = query.records.filter(r => {
  const due = r.getCellValue('Due Date');
  return due && new Date(due) < new Date() && r.getCellValueAsString('Status') !== 'Complete';
});

await table.updateRecordsAsync(
  overdue.map(r => ({ id: r.id, fields: { 'Status': { name: 'Overdue' } } }))
);
output.text(`Обновлено ${overdue.length} записей на статус Просрочено (Overdue)`);
```

## Автоматизация: Новая запись → Уведомление в Slack
```
Триггер: Когда создана запись в [Таблице]
Действие: Запусти скрипт (Run script)

Скрипт:
const record = input.config().record;
const response = await fetch(SLACK_WEBHOOK, {
  method: 'POST',
  body: JSON.stringify({
    text: `Новая запись в ${record.fields['Type']}: ${record.fields['Name']} — назначена на ${record.fields['Owner']}`
  })
});
```

## REST API — Создай записи
```typescript
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = 'appXXXXXXXX';

async function createRecord(tableId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  return res.json();
}
```

## Паттерн синхронизации (Airtable ↔ Внешняя БД)
1. Используй вебхук Airtable → получи информацию об изменениях записи
2. Помести обновление в очередь своей БД
3. Периодически синхронизируй обратно в Airtable по API

## Шпаргалка по формулам
- Дней прошло: `DATETIME_DIFF(TODAY(), {Created}, 'days')`
- Полное имя: `{First} & " " & {Last}`
- Сводка по статусу: `IF({Done Count} = {Total}, "Complete", "In Progress")`
