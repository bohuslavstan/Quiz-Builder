# Quiz Builder

A full-stack web application for creating, managing, and taking interactive quizzes. Built with Next.js (frontend) and Express (backend), with PostgreSQL for data persistence.

## Project Overview

Quiz Builder allows users to:
- Create custom quizzes with multiple question types
- Manage existing quizzes (view, edit, delete)
- Display quiz details with formatted questions
- Support for three question types:
  - **Boolean**: True/False questions
  - **Input**: Text answer questions
  - **Checkbox**: Multiple choice questions

## Architecture

- **Frontend**: Next.js 15 with TypeScript, React 19, and Tailwind CSS
- **Backend**: Express 5.2.1 with TypeScript and Prisma ORM
- **Database**: PostgreSQL with Prisma migrations
- **Code Quality**: ESLint and Prettier configured for both projects

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **PostgreSQL**: v12 or higher ([download](https://www.postgresql.org/download/))

Verify installations:
```bash
node --version
npm --version
psql --version
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_db"
```

### 4. Set up the database
Run Prisma migrations to create tables:
```bash
npm run db:migrate
```

To view the database in Prisma Studio:
```bash
npm run db:studio
```

### 5. Start the backend server
```bash
npm run dev
```

The backend will start on **http://localhost:3000**

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

The `.env.local` should point to your backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start the frontend server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000** (or next available port if 3000 is in use)

## Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Server runs on http://localhost:3000 or http://localhost:3002/3003/etc
```

Once both servers are running, open your browser to the frontend URL shown in the terminal.

## Building for Production

### Backend
```bash
cd backend
npm run build
npm run start
```

### Frontend
```bash
cd frontend
npm run build
npm run start
```

## Code Quality

Both projects include ESLint and Prettier for code quality.

### Format code
```bash
npm run format
```

### Check for lint errors
```bash
npm run lint
```

### Fix lint errors
```bash
npm run lint:fix
```

## Sample Quiz Creation

Here's an example of creating a quiz via the API:

### Create a quiz with cURL
```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "questions": [
      {
        "type": "boolean",
        "question": "JavaScript is a compiled language",
        "answer": false
      },
      {
        "type": "input",
        "question": "What does DOM stand for?",
        "correctAnswer": "Document Object Model"
      },
      {
        "type": "checkbox",
        "question": "Which are JavaScript frameworks?",
        "options": ["React", "Vue", "Angular", "Python"],
        "correctAnswers": [0, 1, 2]
      }
    ]
  }'
```

### Via the frontend UI
1. Navigate to http://localhost:3002 (or your frontend URL)
2. Click "Create Quiz"
3. Enter a quiz title
4. Click "Add Question" and select question type
5. Fill in question details
6. Click "Create Quiz" to save

## API Endpoints Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Health Check
```http
GET /health
```
**Response**: `{ "status": "ok" }`

#### Get All Quizzes
```http
GET /quizzes
```
**Response**:
```json
[
  {
    "id": 1,
    "title": "JavaScript Basics",
    "questionCount": 3
  }
]
```

#### Get Quiz Details
```http
GET /quizzes/:id
```
**Response**:
```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "questions": [
    {
      "type": "boolean",
      "question": "JavaScript is a compiled language",
      "answer": false
    }
  ],
  "createdAt": "2026-02-02T16:40:06.508Z"
}
```

#### Create a Quiz
```http
POST /quizzes
Content-Type: application/json

{
  "title": "Quiz Title",
  "questions": [
    {
      "type": "boolean",
      "question": "Question text?",
      "answer": true
    }
  ]
}
```
**Response**: `201 Created` with the created quiz object

#### Delete a Quiz
```http
DELETE /quizzes/:id
```
**Response**: `204 No Content`

### Question Types

#### Boolean Question
```json
{
  "type": "boolean",
  "question": "Is this true?",
  "answer": true
}
```

#### Input Question
```json
{
  "type": "input",
  "question": "What is the capital of France?",
  "correctAnswer": "Paris"
}
```

#### Checkbox Question
```json
{
  "type": "checkbox",
  "question": "Select all correct options:",
  "options": ["Option A", "Option B", "Option C"],
  "correctAnswers": [0, 2]
}
```

## Database Schema

### Quiz Model
```prisma
model Quiz {
  id        Int      @id @default(autoincrement())
  title     String
  questions Json
  createdAt DateTime @default(now())
}
```

Questions are stored as JSON, allowing flexible question structures.

## Troubleshooting

### Backend connection issues
- Verify PostgreSQL is running: `psql -U postgres`
- Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials
- Ensure migrations have run: `npm run db:migrate`

### Frontend API errors
- Verify backend is running on http://localhost:3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled on backend

### Port already in use
If port 3000 or 3003 is already in use:
- Backend: Change port in `src/index.ts` and update `NEXT_PUBLIC_API_URL`
- Frontend: Next.js automatically uses the next available port

### Database migrations needed
```bash
cd backend
npm run db:migrate
```

## Project Structure

```
Quiz-Builder/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express server and API routes
│   │   └── generated/
│   │       └── prisma/        # Generated Prisma client
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── quizzes/           # Quiz list page
│   │   ├── quizzes/[id]/      # Quiz detail page
│   │   ├── create/            # Quiz creation page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   ├── lib/
│   │   └── api.ts             # API client
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md
```

## Development Tips

- Use Prisma Studio to inspect database: `npm run db:studio`
- Keep frontend and backend terminals visible during development
- Use browser DevTools to inspect network requests
- Enable debug logging by setting `DEBUG=*` environment variable

## Contributing

When contributing, ensure:
1. Code passes linting: `npm run lint`
2. Code is formatted: `npm run format`
3. Changes are tested in both UI and API

## License

This project is open source and available under the MIT License.