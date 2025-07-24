# Simple Chatbot API

## Data Storage Method

This application uses **SQLite** as the database with **Drizzle ORM** for type-safe database operations.

The database schema includes:

- **Chat sessions**: Store conversation state and context data
- **Messages**: Track the conversation history between user and bot

## Setup

### Pre-requisites

- Bun: [Installation Guide](https://bun.com/docs/installation)

### Install Dependencies

```bash
bun install
```

### Environment Variables

```bash
cp .env.example .env
```

### Database Initialization

```bash
bun run db:migrate
```

### Run the Application

```bash
bun run dev
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

Check if the API is running:

```bash
curl http://localhost:8000/health
```

**Response:**

```json
{
  "status": "ok"
}
```

### Chat Session Management

#### 1. Create a New Chat Session

```bash
curl -X POST http://localhost:8000/chat
```

**Response:**

```json
{
  "chatId": "unique-chat-id",
  "messageId": "unique-message-id",
  "message": "Welcome to our restaurant! What would you like to order?",
  "options": ["pizza", "pasta", "salad"]
}
```

#### 2. Send a Response to Chat Session

```bash
curl -X POST http://localhost:8000/chat/{chatId}/respond \
  -H "Content-Type: application/json" \
  -d '{"response": "pizza"}'
```

Replace `{chatId}` with the actual chat ID received from step 1.

**Example Response:**

```json
{
  "messageId": "unique-message-id",
  "message": "Excellent! What kind of crust would you prefer for your Pizza?",
  "options": ["thin_crust", "thick_crust"]
}
```

#### 3. Get Chat History

```bash
curl http://localhost:8000/chat/{chatId}
```

**Response:**

```json
{
  "chatSession": {
    "id": "chat-id",
    "currentState": "waiting_pizza_crust",
    "data": "{\"orderChoice\":\"pizza\"}"
  },
  "messages": [
    {
      "id": "message-id-1",
      "content": "Welcome to our restaurant! What would you like to order?",
      "sender": "bot",
      "timestamp": "2025-07-24T10:30:00Z"
    },
    {
      "id": "message-id-2",
      "content": "pizza",
      "sender": "user",
      "timestamp": "2025-07-24T10:30:30Z"
    }
  ]
}
```
