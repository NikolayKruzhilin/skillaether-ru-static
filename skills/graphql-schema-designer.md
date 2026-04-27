# Архитектор GraphQL Схем

## Правила Дизайна Схемы
1. Проектируй под клиента, а не под базу данных
2. Используй курсорную пагинацию в стиле Relay с первого дня
3. Никогда не отдавай ID из базы напрямую — используй глобальные ID (Global IDs)
4. Все мутации должны возвращать измененный объект (а не просто успех/ошибку)

## Паттерн Пагинации (Relay Cursor)
```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
type UserEdge {
  node: User!
  cursor: String!
}
type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}
type Query {
  users(first: Int, after: String): UserConnection!
}
```

## Предотвращение N+1 через DataLoader
```typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: string[]) => {
  const users = await db.user.findMany({ where: { id: { in: ids } } });
  return ids.map(id => users.find(u => u.id === id));
});

// В резолвере — запросы объединяются автоматически
const resolver = { post: { author: (post) => userLoader.load(post.authorId) } };
```

## Паттерн Мутаций
```graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}
input CreateUserInput { name: String!, email: String! }
type CreateUserPayload {
  user: User
  errors: [UserError!]!
}
type UserError { field: String, message: String! }
```

## Версионирование Схемы
- Никогда не удаляй поля — помечай их устаревшими через `@deprecated(reason: "...")`
- Добавляй поля свободно (это не ломает совместимость)
- Используй фича-флаги для экспериментальных полей
- Запускай линтер схемы: `graphql-inspector diff old.graphql new.graphql`
