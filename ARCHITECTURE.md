# Architecture: Server vs Client Data Fetching

## Схема работы

### 1. CLIENT-SIDE FETCHING (старый подход с axios)

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │ 1. User opens page
       ▼
┌─────────────────────────┐
│   Next.js Page          │
│   'use client'          │
│                         │
│   - Shows skeleton      │
│   - useEffect runs      │
│   - axios.get(...)      │
└──────┬──────────────────┘
       │ 2. HTTP request from browser
       ▼
┌─────────────────────────┐
│   Backend API           │
│   localhost:3001        │
│                         │
│   - Checks cookies      │
│   - Returns data        │
└──────┬──────────────────┘
       │ 3. Response
       ▼
┌─────────────────────────┐
│   Browser               │
│   - React Query cache   │
│   - Updates state       │
│   - Re-renders          │
└─────────────────────────┘

⏱️  Timeline:
0ms    - HTML загрузился (пустой)
0ms    - JavaScript загрузился
100ms  - React гидратировался
100ms  - useEffect запустился
100ms  - axios начал запрос
250ms  - Ответ пришёл
250ms  - Компонент обновился

❌ Проблемы:
- Пустой экран 250ms
- Скелетоны
- Нет SEO (боты видят пустую страницу)
- Два roundtrip (browser→next→backend)
```

---

### 2. SERVER-SIDE FETCHING (новый подход с Server Components)

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │ 1. User opens page
       ▼
┌─────────────────────────────────┐
│   Next.js Server                │
│                                 │
│   async function Page() {       │
│     const data = await fetch()  │  ← Server Component
│     return <UI data={data} />   │
│   }                             │
└──────┬──────────────────────────┘
       │ 2. Internal network request (FAST!)
       ▼
┌─────────────────────────┐
│   Backend API           │
│   localhost:3001        │
│                         │
│   - Server-to-server    │
│   - No CORS             │
│   - Fast LAN            │
└──────┬──────────────────┘
       │ 3. Response
       ▼
┌─────────────────────────┐
│   Next.js Server        │
│   - Renders HTML        │
│   - Includes data       │
│   - Streams to browser  │
└──────┬──────────────────┘
       │ 4. HTML with data
       ▼
┌─────────────────────────┐
│   Browser               │
│   - Instant display!    │
│   - No skeletons        │
│   - SEO friendly        │
└─────────────────────────┘

⏱️  Timeline:
0ms    - Запрос к Next.js
50ms   - Next.js → Backend (internal network)
150ms  - HTML с данными готов
150ms  - Browser получил готовую страницу

✅ Преимущества:
- Данные уже в HTML
- Нет скелетонов
- SEO (боты видят всё)
- Один roundtrip (browser→next)
- Быстрее (internal network)
```

---

## 🤔 Нужен ли axios в проекте?

### Да, но только для Client Components!

```typescript
// ✅ Client Components - axios через React Query
'use client';
export function UserProfile() {
  // Для мутаций, real-time updates, user-specific data
  const { mutate } = useMutation({
    mutationFn: (data) => axiosInstance.post('/profile', data),
  });
}

// ✅ Server Components - native fetch
export default async function Page() {
  // Для initial data, SEO, public content
  const data = await serverFetch('/games');
  return <UI data={data} />;
}
```

---

## 📦 Когда использовать что?

### Server Components (fetch) - Используй для:

| Сценарий                    | Почему                        |
| --------------------------- | ----------------------------- |
| Initial page load           | Нет скелетонов, быстрее       |
| Public data                 | SEO важно                     |
| Редко меняющиеся данные     | Можно кешировать              |
| Список игр, статей, товаров | Не требует авторизации        |
| Фильтрация через URL        | URL = истина, shareable links |

**Пример:**

```typescript
// app/games/page.tsx
export default async function GamesPage() {
  const games = await getGamesServer({ revalidate: 3600 });
  return <GamesList games={games} />;
}
```

### Client Components (axios) - Используй для:

| Сценарий                    | Почему                 |
| --------------------------- | ---------------------- |
| Mutations (POST/PUT/DELETE) | User actions           |
| Real-time updates           | WebSocket, polling     |
| User-specific data          | После логина           |
| Infinite scroll             | Динамическая подгрузка |
| Optimistic updates          | Instant feedback       |

**Пример:**

```typescript
'use client';
export function CreatePost() {
  const { mutate } = useMutation({
    mutationFn: (data) => axios.post('/posts', data),
  });

  return <Form onSubmit={mutate} />;
}
```

---

## 🏗️ Гибридный подход (BEST!)

Комбинируй оба:

```typescript
// app/applications/page.tsx - Server Component
export default async function ApplicationsPage() {
  // 1. Начальные данные - Server (SSR)
  const initialData = await getAllApplicationsServer();

  // 2. Передаём в Client Component для интерактивности
  return <ApplicationsClient initialData={initialData} />;
}

// ApplicationsClient.tsx - Client Component
'use client';
export function ApplicationsClient({ initialData }) {
  // 3. React Query с initialData - нет скелетона!
  const { data } = useQuery({
    queryKey: ['applications'],
    queryFn: () => axios.get('/applications'),
    initialData, // ← Нет начальной загрузки!
  });

  // 4. Mutations через axios
  const { mutate } = useMutation({
    mutationFn: (data) => axios.post('/applications', data),
  });

  return <UI data={data} onCreate={mutate} />;
}
```

**Результат:**
✅ Мгновенная первая загрузка (Server)
✅ Интерактивность (Client)
✅ SEO (Server)
✅ Real-time updates (Client)

---

## 🔍 Детали реализации

### serverFetch vs axios

```typescript
// shared/lib/server-fetch.ts
import { cookies } from 'next/headers';

export async function serverFetch(endpoint: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  return fetch(`${BACKEND_URL}${endpoint}`, {
    headers: {
      Cookie: cookieHeader, // ← Автоматически!
    },
    next: {
      revalidate: 3600, // ← Next.js caching!
      tags: ['games'], // ← Invalidation!
    },
  });
}
```

**vs**

```typescript
// shared/services/axios.ts
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // ← Браузер передаёт cookies
});

// ❌ Нет Next.js caching
// ❌ Нет revalidation
// ❌ Runs in browser
```

---

## 🎯 Практические примеры

### Пример 1: Каталог игр (Public)

```typescript
// ✅ Server Component
export default async function GamesPage() {
  const games = await serverFetch('/games', {
    next: { revalidate: 3600 } // Кеш 1 час
  });

  return (
    <div>
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
```

**Почему Server?**

- Public data (не требует auth)
- SEO critical
- Редко меняется
- Нужен быстрый initial load

### Пример 2: Профиль пользователя (Private)

```typescript
// ❓ Гибрид: Server + Client
export default async function ProfilePage() {
  // Server: Начальные данные
  const initialProfile = await serverFetch('/profile');

  return <ProfileEditor initialData={initialProfile} />;
}

// Client: Редактирование
'use client';
function ProfileEditor({ initialData }) {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axios.get('/profile'),
    initialData, // ← Нет загрузки!
  });

  const { mutate } = useMutation({
    mutationFn: (data) => axios.patch('/profile', data),
  });

  return <Form data={data} onSubmit={mutate} />;
}
```

### Пример 3: Real-time чат (Dynamic)

```typescript
// ✅ Client Component
'use client';
export function ChatRoom() {
  const { data, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: () => axios.get('/messages'),
    refetchInterval: 1000, // Poll каждую секунду
  });

  const { mutate } = useMutation({
    mutationFn: (msg) => axios.post('/messages', msg),
    onSuccess: () => refetch(),
  });

  return <Chat messages={data} onSend={mutate} />;
}
```

**Почему Client?**

- Real-time updates
- User-specific
- Mutations
- SEO не важно

---

## 💡 Итог

### Можно ли удалить axios?

**НЕТ!** Axios всё ещё нужен для:

- ✅ Mutations (POST/PATCH/DELETE)
- ✅ Client-side data fetching
- ✅ Real-time updates
- ✅ User-specific data
- ✅ Infinite scroll / pagination
- ✅ Optimistic updates

### Что изменилось?

**Раньше:**

```typescript
100% axios (всё на клиенте)
```

**Сейчас:**

```typescript
70% Server Components (fetch)    ← Initial data, SEO
30% Client Components (axios)    ← Mutations, real-time
```

### Golden Rule:

```
┌─────────────────────────────────────────────┐
│  Server Components для ЧТЕНИЯ              │
│  Client Components для ЗАПИСИ              │
└─────────────────────────────────────────────┘

Read  → Server  → fetch  → Fast, SEO, Cache
Write → Client  → axios  → Mutations, Real-time
```

---

## 🚀 Оптимизация

### Reduce JavaScript bundle

**Раньше:**

```
Bundle size: 250KB
- axios: 15KB
- react-query: 40KB
- Used on EVERY page
```

**Сейчас:**

```
Home page: 180KB (-70KB!)
- No axios (Server Component)
- No react-query
- Pure HTML + minimal JS

Applications page: 250KB
- Has axios (Client mutations)
- Has react-query
- Only where needed
```

---

## 📚 Best Practices

### 1. Default to Server Components

```typescript
// ✅ Start here
export default async function Page() {
  const data = await serverFetch('/data');
  return <UI data={data} />;
}

// ❌ Don't start here
'use client';
export default function Page() {
  const { data } = useQuery(...);
  return <UI data={data} />;
}
```

### 2. Add 'use client' only when needed

```typescript
// Server Component (default)
async function GamesList() {
  const games = await serverFetch('/games');
  return (
    <div>
      {games.map(game => (
        // Client Component only for interactivity
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

// Client Component
'use client';
function GameCard({ game }) {
  const [liked, setLiked] = useState(false);
  return (
    <div onClick={() => setLiked(!liked)}>
      {game.name}
    </div>
  );
}
```

### 3. Separate server/client APIs

```
services/
├── games/
│   ├── games.api.ts           ← axios (client)
│   ├── games.hooks.ts         ← React Query (client)
│   └── server/
│       └── games.server.ts    ← fetch (server)
```

---

## 🎓 Вывод

**Нужен ли axios?** → Да, но меньше!

**Как это работает?**

```
Server Components:
  Next.js Server → fetch → Backend → HTML → Browser
  (Без участия браузера!)

Client Components:
  Browser → axios → Backend → State → Re-render
  (Как раньше)
```

**Когда что использовать?**

- Initial load → Server (fetch)
- Mutations → Client (axios)
- Public data → Server
- Private data → Hybrid (Server initial + Client mutations)
