#README
# Notification System — Architecture Design

## 1. Overview

The Notification System is a full-stack application that enables creation, delivery, and management of real-time notifications across a platform. It is composed of three independent modules:

| Module | Role |
|---|---|
| `logging_middleware` | Reusable TypeScript package; sends structured logs to the Affordmed evaluation server |
| `notification_app_be` | RESTful backend API built with Express + TypeScript + PostgreSQL |
| `notification_app_fe` | React + TypeScript single-page dashboard for managing notifications |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │          notification_app_fe  (React + Vite)       │    │
│   │  ┌───────────┐  ┌─────────────┐  ┌────────────┐  │    │
│   │  │  Header   │  │  StatsBar   │  │NotiForm    │  │    │
│   │  └───────────┘  └─────────────┘  └────────────┘  │    │
│   │        ┌──────────────────────────────┐           │    │
│   │        │     NotificationCard (list)  │           │    │
│   │        └──────────────────────────────┘           │    │
│   └───────────────────┬───────────────────────────────┘    │
│                       │  HTTP REST (JSON)                   │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                  API LAYER                                   │
│                       ▼                                      │
│   ┌───────────────────────────────────────────────────┐     │
│   │       notification_app_be  (Express + TypeScript)  │     │
│   │                                                    │     │
│   │  ┌────────────┐   ┌───────────────────────────┐   │     │
│   │  │   CORS     │   │   Request Logger (MW)     │   │     │
│   │  └────────────┘   └───────────────────────────┘   │     │
│   │                                                    │     │
│   │  ┌─────────────────────────────────────────────┐  │     │
│   │  │          /notifications  Router              │  │     │
│   │  │  POST /         GET /         GET /:id       │  │     │
│   │  │  PATCH /:id/read             DELETE /:id     │  │     │
│   │  └─────────────────────────────────────────────┘  │     │
│   │                       │                            │     │
│   │  Controller → DB Pool │                            │     │
│   └───────────────────────┼────────────────────────────┘     │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────┐
│                  DATA LAYER                                    │
│                           ▼                                    │
│   ┌────────────────────────────────────────────────────┐      │
│   │              PostgreSQL Database                    │      │
│   │                                                    │      │
│   │  Table: notifications                              │      │
│   │  ┌──────────────┬──────────────────────────────┐  │      │
│   │  │  id (UUID)   │  PRIMARY KEY                 │  │      │
│   │  │  title       │  VARCHAR(255) NOT NULL        │  │      │
│   │  │  message     │  TEXT NOT NULL                │  │      │
│   │  │  type        │  ENUM(info/warning/alert/ok)  │  │      │
│   │  │  recipient_id│  VARCHAR(255) NOT NULL        │  │      │
│   │  │  is_read     │  BOOLEAN DEFAULT false        │  │      │
│   │  │  created_at  │  TIMESTAMPTZ DEFAULT NOW()    │  │      │
│   │  └──────────────┴──────────────────────────────┘  │      │
│   └────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────┐
│                 LOGGING LAYER                                  │
│                           ▼                                    │
│   ┌────────────────────────────────────────────────────┐      │
│   │        logging_middleware  (TypeScript package)     │      │
│   │                                                    │      │
│   │   Log(stack, level, package, message)              │      │
│   │          │                                         │      │
│   │          ▼                                         │      │
│   │   POST http://4.224.186.213/evaluation-service/logs│      │
│   │   Authorization: Bearer <token>                    │      │
│   └────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. API Contract

### Base URL
```
http://localhost:3000
```

### Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/notifications` | Create a notification |
| `GET` | `/notifications` | List all notifications |
| `GET` | `/notifications/:id` | Get single notification |
| `PATCH` | `/notifications/:id/read` | Mark notification as read |
| `DELETE` | `/notifications/:id` | Delete a notification |

### POST `/notifications` — Request Body
```json
{
  "title": "Server Alert",
  "message": "CPU usage exceeded 90% threshold",
  "type": "alert",
  "recipientId": "user_001"
}
```

### POST `/notifications` — Response `201`
```json
{
  "id": "a3f1c2d4-11b2-4c3e-8f9a-1234567890ab",
  "title": "Server Alert",
  "message": "CPU usage exceeded 90% threshold",
  "type": "alert",
  "recipientId": "user_001",
  "isRead": false,
  "createdAt": "2026-05-16T10:00:00.000Z"
}
```

### GET `/notifications` — Query Params (optional)
| Param | Type | Description |
|---|---|---|
| `recipientId` | string | Filter by recipient |
| `type` | string | Filter by type |
| `isRead` | boolean | Filter by read status |

---

## 4. Data Model

### Notification
```typescript
interface Notification {
  id: string;             // UUID
  title: string;          // Short title
  message: string;        // Full notification body
  type: NotificationType; // 'info' | 'warning' | 'alert' | 'success'
  recipientId: string;    // Target user/system identifier
  isRead: boolean;        // Has been acknowledged
  createdAt: Date;        // Creation timestamp
}
```

---

## 5. Technology Choices

| Layer | Technology | Rationale |
|---|---|---|
| Backend runtime | Node.js 20+ | Native ESM support, TypeScript-first |
| Backend framework | Express 4 | Lightweight, production-proven, easy REST API authoring |
| Database | PostgreSQL | ACID-compliant, UUID support, rich indexing, production-grade |
| DB client | `pg` (node-postgres) | De facto standard for PostgreSQL in Node.js |
| Dev server | `tsx --watch` | Fast TS execution without separate compile step in dev |
| Frontend framework | React 18 + Vite | Fast HMR, minimal config, component-driven UI |
| Styling | Vanilla CSS | As per evaluation guidelines (no Tailwind) |
| Logging | logging-middleware | Custom reusable package sending structured logs to eval server |

---

## 6. Logging Strategy

The `Log(stack, level, package, message)` function is integrated at every meaningful lifecycle event:

| Event | stack | level | package | message |
|---|---|---|---|---|
| Server startup | `backend` | `info` | `server` | `Notification API started on port 3000` |
| Incoming request | `backend` | `info` | `express` | `POST /notifications` |
| DB connected | `backend` | `info` | `database` | `Connected to PostgreSQL` |
| DB schema init | `backend` | `info` | `database` | `Schema initialized` |
| Notification created | `backend` | `info` | `notifications` | `Created notification id=<uuid>` |
| Notification fetched | `backend` | `info` | `notifications` | `Fetched N notifications` |
| Notification read | `backend` | `info` | `notifications` | `Marked <id> as read` |
| Notification deleted | `backend` | `info` | `notifications` | `Deleted notification <id>` |
| Validation error | `backend` | `warning` | `notifications` | `Invalid payload: <detail>` |
| DB error | `backend` | `error` | `database` | `Query failed: <message>` |
| Frontend API call | `frontend` | `info` | `api` | `Fetching notifications` |
| Frontend error | `frontend` | `error` | `api` | `Request failed: <message>` |

---

## 7. Security Considerations

- CORS configured to allow frontend origin only
- Input validation on all POST/PATCH endpoints
- Parameterized queries to prevent SQL injection
- Environment variables for all credentials (`.env` file, not committed)
- Bearer token stored in `.env`, never hardcoded

---

## 8. Folder Structure

```
22MIS0589/
├── logging_middleware/           # Reusable logging package
│   ├── src/
│   │   ├── logger.ts             # Log() function implementation
│   │   └── test.ts               # Manual test
│   ├── dist/                     # Compiled output (git-ignored)
│   ├── package.json
│   └── tsconfig.json
│
├── notification_system_design.md # This document
│
├── notification_app_be/          # Backend REST API
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── utils/logger.ts       # Logging utility (mirrors middleware)
│   │   ├── db/
│   │   │   ├── index.ts          # pg Pool + initDB()
│   │   │   └── schema.sql        # DDL for notifications table
│   │   ├── models/
│   │   │   └── notification.ts   # TypeScript interfaces
│   │   ├── controllers/
│   │   │   └── notificationController.ts
│   │   └── routes/
│   │       └── notifications.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── notification_app_fe/          # Frontend React SPA
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── utils/logger.ts       # Logging utility
    │   ├── types/
    │   │   └── notification.ts
    │   ├── api/
    │   │   └── notifications.ts
    │   └── components/
    │       ├── Header.tsx
    │       ├── StatsBar.tsx
    │       ├── NotificationForm.tsx
    │       └── NotificationCard.tsx
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── tsconfig.node.json
```
