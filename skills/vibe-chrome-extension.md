# Vibe Chrome Extension

## Структура проекта
```
my-extension/
  manifest.json       — конфиг расширения (обязательно)
  popup/
    popup.html        — UI при клике на иконку
    popup.js
  content/
    content.js        — скрипт, работающий внутри веб-страниц
  background/
    service-worker.js — фоновая логика
  icons/
    16.png, 48.png, 128.png
```

## manifest.json (Manifest V3)
```json
{
  "manifest_version": 3,
  "name": "Мое Расширение",
  "version": "1.0",
  "description": "Что оно делает одним предложением",
  "action": { "default_popup": "popup/popup.html", "default_icon": "icons/48.png" },
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "background/service-worker.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content.js"]
  }],
  "icons": { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" }
}
```

## Обмен сообщениями (popup ↔ content script)
```javascript
// popup.js — отправить сообщение в активную вкладку
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageData' });
console.log(response.data);

// content.js — принять и ответить
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getPageData') {
    sendResponse({ data: document.title });
  }
  return true; // держим канал открытым для асинхронного ответа
});
```

## Хранение данных (Storage)
```javascript
// Сохранить
await chrome.storage.local.set({ key: 'значение' });
// Прочитать
const result = await chrome.storage.local.get(['key']);
console.log(result.key);
// Синхронизация между устройствами (через Google аккаунт)
await chrome.storage.sync.set({ settings: { theme: 'dark' } });
```

## Как запустить в Chrome (разработка)
1. Зайди на страницу `chrome://extensions`
2. Включи Режим разработчика (Developer mode)
3. Нажми "Загрузить распакованное расширение" (Load unpacked) → выбери папку проекта

## Публикация в Web Store
1. Заплати $5 взнос разработчика (разово)
2. Сделай ZIP-архив папки расширения
3. Загрузи в [Панель разработчика Chrome Web Store]
4. Заполни описание, добавь скриншоты
5. Отправь на ревью (~3-5 дней)
