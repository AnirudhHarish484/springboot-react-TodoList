# Todo App

Simple fullstack todo app — Spring Boot + React + MySQL.

## Files

```
backend/
  App.java            ← entry point
  Todo.java           ← entity
  TodoRepository.java ← JPA repo
  TodoController.java ← REST API
  application.properties

frontend/
  src/App.jsx         ← entire UI in one file
```

## Setup

### 1. Set your MySQL password
Edit `backend/src/main/resources/application.properties`:
```
spring.datasource.password=your_password
```

### 2. Run backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Run frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API
| Method | URL | What it does |
|--------|-----|--------------|
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create todo |
| PUT | /api/todos/{id} | Update todo |
| DELETE | /api/todos/{id} | Delete todo |
