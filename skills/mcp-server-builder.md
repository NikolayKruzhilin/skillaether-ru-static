# Билдер MCP-Серверов

## Что такое MCP?
Model Context Protocol позволяет тебе дать любому MCP-совместимому ИИ (Claude, Cursor, Windsurf)
кастомные инструменты (tools), которые он может вызывать, ресурсы, которые он может читать, и промпты.

Думай об этом как о создании собственных плагинов для ИИ-ассистентов.

## Настройка проекта
```bash
npm install @modelcontextprotocol/sdk
# или на Python:
pip install mcp
```

## TypeScript MCP Сервер
```typescript
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'my-tools', version: '1.0.0' });

// Регистрация инструмента (Tool)
server.tool(
  'search_codebase',
  { query: z.string().describe('Поисковый запрос по кодовой базе') },
  async ({ query }) => {
    const results = await searchCode(query);
    return { content: [{ type: 'text', text: JSON.stringify(results) }] };
  }
);

// Регистрация ресурса
server.resource(
  'project-docs',
  new ResourceTemplate('docs://{filename}', { list: undefined }),
  async (uri) => {
    const content = await readFile(uri.pathname);
    return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: content }] };
  }
);

// Запуск
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Конфиг для Claude Desktop
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "my-tools": {
      "command": "node",
      "args": ["/путь/до/твоего/сервера/index.js"],
      "env": { "API_KEY": "твой-ключ" }
    }
  }
}
```

## Идеи полезных MCP-инструментов
- Поиск по корпоративному Notion / Confluence
- Запросы к рабочей базе данных (только чтение)
- Получение живой документации API или чейнджлогов
- Запуск линтинга текущего файла
- Получение тикетов из Jira / Linear
- Просмотр компонентов внутренней дизайн-системы

## Дебаггинг
```bash
# Проверь сервер локально через MCP inspector
npx @modelcontextprotocol/inspector node index.js
```
Это откроет интерфейс, где ты сможешь вызывать свои инструменты напрямую перед подключением к Claude.
