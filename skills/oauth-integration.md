# Интеграция OAuth2

## Auth.js (NextAuth v5) — рекомендуется для Next.js
```typescript
// auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
    GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
  ],
  callbacks: {
    session: ({ session, token }) => ({ ...session, userId: token.sub }),
  },
});

// app/api/auth/[...nextauth]/route.ts
export const { GET, POST } = handlers;
```

## Ручной флоу OAuth2 (с использованием PKCE)
```typescript
// Шаг 1: Генерация code verifier и challenge
const verifier = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
const challenge = base64url(await crypto.subtle.digest('SHA-256', encoder.encode(verifier)));

// Шаг 2: Редирект на провайдера
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'email profile');
authUrl.searchParams.set('code_challenge', challenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', state); // сохрани в сессии

// Шаг 3: Обмен кода на токены
const tokens = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: new URLSearchParams({ code, client_id, client_secret, redirect_uri, code_verifier: verifier, grant_type: 'authorization_code' })
}).then(r => r.json());
```

## Паттерн обновления токена (Token Refresh)
```typescript
async function getValidToken(userId: string) {
  const token = await db.token.findUnique({ where: { userId } });
  if (token.expiresAt > new Date()) return token.accessToken;
  // Обновление
  const newToken = await refreshAccessToken(token.refreshToken);
  await db.token.update({ where: { userId }, data: newToken });
  return newToken.accessToken;
}
```

## Необходимые переменные окружения (ENV)
```
GOOGLE_ID=
GOOGLE_SECRET=
GITHUB_ID=
GITHUB_SECRET=
AUTH_SECRET= # сгенерируй: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```
