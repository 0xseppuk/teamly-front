# Teamly - Product Concept & Architecture

## 🎯 Текущее состояние

### Есть сейчас:
- ✅ Регистрация/Авторизация
- ✅ Профиль пользователя
- ✅ Каталог игр
- ✅ Создание заявок на игру
- ✅ Просмотр всех заявок
- ✅ Фильтрация заявок (игра, платформа, голосовой чат)

### Чего не хватает:
- ❌ Отклики на заявки (Application Requests)
- ❌ Чат/Переписка
- ❌ Уведомления
- ❌ Система статусов (pending/accepted/rejected)
- ❌ Управление участниками команды

---

## 🏗️ Архитектура данных

### Текущая модель данных:

```typescript
// User (есть)
interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  created_at: string;
}

// Game (есть)
interface Game {
  id: string;
  name: string;
  slug: string;
  icon_url: string;
}

// GameApplication (есть)
interface GameApplication {
  id: string;
  user_id: string;          // Создатель заявки
  game_id: string;
  title: string;
  description: string;
  max_players: number;
  min_players: number;
  accepted_players: number; // Текущее кол-во принятых
  prime_time_start: string;
  prime_time_end: string;
  is_active: boolean;
  is_full: boolean;
  with_voice_chat: boolean;
  platform: Platform;
  created_at: string;
}
```

---

## 📋 Новые сущности (что нужно добавить)

### 1. ApplicationRequest (Отклик на заявку)

```typescript
interface ApplicationRequest {
  id: string;
  application_id: string;  // На какую заявку откликнулись
  user_id: string;         // Кто откликнулся
  status: RequestStatus;   // pending | accepted | rejected
  message?: string;        // Сообщение при отклике
  created_at: string;
  updated_at: string;

  // Relations
  application: GameApplication;
  user: User;
}

type RequestStatus = 'pending' | 'accepted' | 'rejected';
```

**Бизнес-логика:**
- Пользователь видит заявку
- Кликает "Откликнуться"
- Заполняет небольшую форму (опционально сообщение)
- Создатель заявки видит список откликов
- Может принять или отклонить

---

### 2. Conversation (Переписка)

```typescript
interface Conversation {
  id: string;
  application_id: string;  // Связь с заявкой
  participants: string[];  // [user_id1, user_id2, ...]
  last_message_at: string;
  created_at: string;

  // Relations
  messages: Message[];
  participantUsers: User[];
}
```

---

### 3. Message (Сообщение)

```typescript
interface Message {
  id: string;
  conversation_id: string;
  user_id: string;         // Кто отправил
  content: string;
  is_read: boolean;
  created_at: string;

  // Relations
  user: User;
}
```

---

### 4. Notification (Уведомление)

```typescript
interface Notification {
  id: string;
  user_id: string;         // Кому уведомление
  type: NotificationType;
  title: string;
  message: string;
  link?: string;           // Ссылка на связанную сущность
  is_read: boolean;
  created_at: string;
}

type NotificationType =
  | 'new_request'          // Новый отклик на вашу заявку
  | 'request_accepted'     // Ваш отклик приняли
  | 'request_rejected'     // Ваш отклик отклонили
  | 'new_message'          // Новое сообщение
  | 'application_full'     // Команда набрана
  | 'application_canceled'; // Заявка отменена
```

---

## 🔄 User Flow (Пользовательские сценарии)

### Сценарий 1: Создание заявки

```
1. User → Главная страница → Выбирает игру
2. → Страница заявок по игре
3. → Кнопка "Создать заявку"
4. → Форма создания:
   - Название
   - Описание
   - Кол-во игроков (min/max)
   - Время игры
   - Платформа
   - Голосовой чат
5. → Создаётся заявка со статусом is_active = true
6. → Редирект на страницу заявки /applications/[id]
```

---

### Сценарий 2: Отклик на заявку

```
1. User → Просматривает заявки
2. → Видит интересную заявку
3. → Кликает "Откликнуться"
4. → Модалка:
   - "Почему хотите присоединиться?" (опционально)
   - Кнопка "Отправить отклик"
5. → Создаётся ApplicationRequest со статусом 'pending'
6. → Создателю заявки приходит уведомление
7. → User видит статус "Отклик отправлен" на карточке
```

---

### Сценарий 3: Управление откликами (Создатель заявки)

```
1. Owner → Открывает свою заявку
2. → Видит вкладки:
   - "Описание"
   - "Отклики (5)" ← badge с кол-вом
3. → Переходит на вкладку откликов
4. → Видит список:
   [User Avatar] [Nickname]
   "Сообщение от пользователя..."
   [Принять] [Отклонить]

5. Owner кликает "Принять":
   → ApplicationRequest.status = 'accepted'
   → Application.accepted_players += 1
   → Создаётся Conversation для общения
   → User получает уведомление "Ваш отклик принят!"
   → Открывается чат

6. Owner кликает "Отклонить":
   → ApplicationRequest.status = 'rejected'
   → User получает уведомление "Ваш отклик отклонён"
```

---

### Сценарий 4: Чат

```
1. После принятия отклика:
   → Создаётся Conversation
   → participants = [owner_id, user_id]
   → application_id = текущая заявка

2. Owner и User видят в навбаре:
   - Иконка сообщений с badge (кол-во непрочитанных)

3. Страница чатов /messages:
   - Список всех conversations
   - Показывает последнее сообщение
   - Badge с непрочитанными

4. Открыв conversation:
   - История сообщений
   - Input для нового сообщения
   - Real-time обновления (можно WebSocket или polling)
```

---

## 🎨 UI/UX концепт

### Страница заявки (детальная)

```
┌─────────────────────────────────────────────────┐
│ [← Назад]                    [Редактировать]    │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │  [Game Icon]  CS:GO                       │   │
│ │                                            │   │
│ │  Ищем тиммейтов для ранкеда              │   │
│ │  by @nickname                              │   │
│ │                                            │   │
│ │  👥 2/5   🎮 PC   🎤 Voice   🕐 18:00-23:00│   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ Tabs:                                           │
│ [Описание] [Отклики (3)] [Участники (2)]       │
│ ━━━━━━━                                         │
│                                                  │
│ О заявке:                                       │
│ Ищем адекватных игроков для катки в ранкед.    │
│ Желательно со своими картами и навыками.       │
│                                                  │
│ Требования:                                     │
│ - Ранг: Gold Nova и выше                        │
│ - Микрофон обязателен                          │
│ - Без токсиков                                 │
│                                                  │
│ [Откликнуться]  ← Если НЕ создатель            │
│ [Закрыть набор] ← Если создатель               │
└─────────────────────────────────────────────────┘
```

---

### Вкладка "Отклики" (для создателя)

```
┌─────────────────────────────────────────────────┐
│ Отклики (3)                                      │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ [@avatar] @player123                      │   │
│ │ "Играю уже 3 года, Gold Nova Master"     │   │
│ │                                            │   │
│ │ [✓ Принять] [✗ Отклонить]                │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ [@avatar] @gamer456                       │   │
│ │ Статус: ✓ Принят                          │   │
│ │                                            │   │
│ │ [💬 Написать]                              │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ [@avatar] @noob789                        │   │
│ │ Статус: ✗ Отклонён                        │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

### Вкладка "Участники"

```
┌─────────────────────────────────────────────────┐
│ Участники команды (2/5)                         │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ [@avatar] @creator                        │   │
│ │ Создатель • В сети                        │   │
│ │ [💬 Написать]                              │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ [@avatar] @player123                      │   │
│ │ Участник • Был 2 часа назад               │   │
│ │ [💬 Написать] [🚫 Исключить] ← для owner  │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

### Страница сообщений

```
┌─────────────────────────────────────────────────┐
│ Сообщения                                        │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Список чатов          │ Переписка        │   │
│ │                       │                   │   │
│ │ [CS:GO - Ищем...]    │ [@player123]      │   │
│ │ @player123           │ ──────────────────│   │
│ │ "Окей, созвон..."    │                   │   │
│ │ (2) ← непрочитанные  │ Привет! Когда    │   │
│ │                       │ начинаем?        │   │
│ │ [Dota 2 - Катки]     │                   │   │
│ │ @gamer456            │ [Ты]              │   │
│ │ "Го в 20:00"         │ В 20:00 можем    │   │
│ │                       │                   │   │
│ │                       │ [@player123]      │   │
│ │                       │ Отлично!         │   │
│ │                       │                   │   │
│ │                       │ ──────────────────│   │
│ │                       │ [Напишите...]  [→]│   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🔔 Уведомления

### В навбаре:

```
[🔔 (3)] ← Badge с кол-вом непрочитанных
```

### Dropdown:

```
┌─────────────────────────────────────┐
│ Уведомления                          │
│                                      │
│ 🎮 @player123 откликнулся на вашу   │
│    заявку "CS:GO - Ищем тиммейтов"  │
│    2 минуты назад                    │
│                                      │
│ ✅ Ваш отклик на "Dota 2 - Катки"   │
│    был принят!                       │
│    5 минут назад                     │
│                                      │
│ 💬 Новое сообщение от @gamer456      │
│    10 минут назад                    │
│                                      │
│ [Показать все]                       │
└─────────────────────────────────────┘
```

---

## 📱 Роутинг

### Новые страницы:

```
/applications/[id]              - Детальная страница заявки
/applications/[id]/requests     - Список откликов (только для owner)
/messages                       - Список чатов
/messages/[conversationId]      - Конкретный чат
/notifications                  - Все уведомления
/profile/applications           - Мои заявки
/profile/requests               - Мои отклики
```

---

## 🎯 Фичи (приоритизация)

### MVP (Минимум для работы):

**Phase 1: Отклики** (1-2 недели)
- [ ] ApplicationRequest model
- [ ] Кнопка "Откликнуться" на карточке
- [ ] Список откликов для owner
- [ ] Принять/Отклонить отклик
- [ ] Обновление счётчика accepted_players

**Phase 2: Базовый чат** (1-2 недели)
- [ ] Conversation model
- [ ] Message model
- [ ] Создание conversation при принятии отклика
- [ ] Страница /messages
- [ ] Отправка/получение сообщений
- [ ] Polling для обновлений (каждые 5 сек)

**Phase 3: Уведомления** (1 неделя)
- [ ] Notification model
- [ ] Badge в навбаре
- [ ] Dropdown с уведомлениями
- [ ] Создание уведомлений при событиях

---

### Nice to have (Потом):

**Phase 4: Улучшения чата**
- [ ] WebSocket для real-time
- [ ] Typing indicators
- [ ] Read receipts (прочитано)
- [ ] Emoji picker
- [ ] File uploads (скриншоты, видео)

**Phase 5: Социальные фичи**
- [ ] Профиль игрока (детальный)
- [ ] Друзья/Подписки
- [ ] Рейтинг игроков
- [ ] Отзывы о игроках
- [ ] Статистика игр

**Phase 6: Gamification**
- [ ] Достижения
- [ ] Уровни
- [ ] Бейджи
- [ ] Лидерборды

---

## 🏗️ Технический стек

### Backend API (новые эндпоинты):

```typescript
// Application Requests
POST   /api/applications/:id/requests        - Создать отклик
GET    /api/applications/:id/requests        - Получить отклики (owner)
PATCH  /api/applications/requests/:id/accept - Принять отклик
PATCH  /api/applications/requests/:id/reject - Отклонить отклик
GET    /api/users/me/requests                - Мои отклики

// Conversations
GET    /api/conversations                    - Список чатов
GET    /api/conversations/:id                - Конкретный чат
POST   /api/conversations/:id/messages       - Отправить сообщение
GET    /api/conversations/:id/messages       - Получить сообщения
PATCH  /api/conversations/:id/read           - Отметить прочитанными

// Notifications
GET    /api/notifications                    - Получить уведомления
PATCH  /api/notifications/:id/read           - Отметить прочитанным
PATCH  /api/notifications/read-all           - Отметить все прочитанными
```

---

### Frontend структура:

```
app/
├── applications/
│   └── [id]/
│       ├── page.tsx              # Детальная страница
│       ├── requests/
│       │   └── page.tsx          # Список откликов
│       └── loading.tsx
│
├── messages/
│   ├── page.tsx                  # Список чатов
│   ├── [conversationId]/
│   │   └── page.tsx              # Конкретный чат
│   └── loading.tsx
│
├── notifications/
│   └── page.tsx
│
└── profile/
    ├── applications/
    │   └── page.tsx              # Мои заявки
    └── requests/
        └── page.tsx              # Мои отклики

feature/
├── Applications/
│   └── ui/
│       ├── ApplicationDetails.tsx
│       ├── RequestCard.tsx
│       ├── RequestList.tsx
│       └── SendRequestModal.tsx
│
├── Messages/
│   └── ui/
│       ├── ConversationList.tsx
│       ├── ConversationItem.tsx
│       ├── MessageList.tsx
│       ├── MessageInput.tsx
│       └── ChatWindow.tsx
│
└── Notifications/
    └── ui/
        ├── NotificationBadge.tsx
        ├── NotificationDropdown.tsx
        └── NotificationItem.tsx
```

---

## 🔐 Безопасность & Права доступа

### Application Requests:

```typescript
// Кто может откликнуться:
- Авторизованные пользователи
- НЕ создатель заявки
- НЕ уже откликнувшиеся
- Заявка is_active = true
- Заявка НЕ is_full

// Кто может видеть отклики:
- Только создатель заявки

// Кто может принять/отклонить:
- Только создатель заявки
```

### Messages:

```typescript
// Кто может видеть conversation:
- Только participants

// Кто может писать:
- Только participants
```

### Notifications:

```typescript
// Кто может видеть:
- Только владелец уведомления
```

---

## 📊 База данных (схема связей)

```
User ──1:N─→ GameApplication (создатель)
User ──1:N─→ ApplicationRequest (откликнувшийся)
User ──N:N─→ Conversation (участники)
User ──1:N─→ Message (отправитель)
User ──1:N─→ Notification (получатель)

GameApplication ──1:N─→ ApplicationRequest
GameApplication ──1:N─→ Conversation

ApplicationRequest ──N:1─→ GameApplication
ApplicationRequest ──N:1─→ User

Conversation ──1:N─→ Message
Conversation ──N:1─→ GameApplication
Conversation ──N:N─→ User (через промежуточную таблицу)

Message ──N:1─→ Conversation
Message ──N:1─→ User

Notification ──N:1─→ User
```

---

## 🚀 Roadmap (Пошаговая реализация)

### Week 1-2: Application Requests
1. Backend: Models + API
2. Frontend: UI компоненты
3. Интеграция
4. Тестирование

### Week 3-4: Messaging
1. Backend: Models + API
2. Frontend: Chat UI
3. Polling mechanism
4. Тестирование

### Week 5: Notifications
1. Backend: Model + API
2. Frontend: Badge + Dropdown
3. Event triggers
4. Тестирование

### Week 6: Polish & Deploy
1. Bug fixes
2. UI/UX improvements
3. Performance optimization
4. Production deploy

---

## 💡 Дополнительные идеи

### Фильтры для заявок:
- По рангу/уровню
- По языку
- По региону/timezone
- По режиму игры (casual/ranked)

### Статусы заявки:
- draft (черновик)
- active (активна)
- full (набрана)
- in_progress (игра началась)
- completed (завершена)
- canceled (отменена)

### Групповые чаты:
- Общий чат всей команды
- Приватные чаты 1-on-1

### Календарь:
- Запланированные сессии
- Напоминания
- Интеграция с Google Calendar

---

## ✅ Checklist для старта

- [ ] Обсудить концепт с командой
- [ ] Утвердить приоритеты фич
- [ ] Создать mockups/wireframes
- [ ] Описать API спецификацию
- [ ] Создать database migrations
- [ ] Начать с Phase 1 (Requests)

---

**Следующий шаг:** Начать с реализации Application Requests?
