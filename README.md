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

## API Endpoints

### Chat Session

1. Create a new chat session:

```bash
curl -X POST http://localhost:8000/chat
```

2. Send a message to the chat session:

```bash
curl -X POST http://localhost:8000/chat/{chatId} -H "Content-Type: application/json" -d '{"response": {user_response}}'
```

3. Get chat history:

```bash
curl http://localhost:8000/chat/{chatId}
```
