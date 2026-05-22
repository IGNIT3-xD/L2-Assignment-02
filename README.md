# DevPulse 🛠️

A RESTful Issue Tracker API built with Node.js, Express, TypeScript, and PostgreSQL. Supports role-based access control, JWT authentication, and full issue lifecycle management.

**Live API:** https://l2-assignment-2-woad.vercel.app

---

## Features

- JWT-based authentication with access & refresh tokens
- Role-based access control (Contributor, Maintainer)
- Full CRUD for issues with status lifecycle management
- Contributor ownership checks — contributors can only update their own open issues
- Filtering issues by type and status, sorting by newest/oldest
- Global error handling with environment-aware stack traces
- Password hashing with bcrypt
- CORS enabled for frontend integration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL (via `pg`) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | bcrypt |
| Build Tool | tsup |
| Dev Server | tsx |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/IGNIT3-xD/L2-Assignment-02
cd L2-Assignment-02

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB=your_postgresql_connection_string
JWT_ACCESS=your_access_token_secret
JWT_REFRESH=your_refresh_token_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## Database Schema

### `users`

| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incremented ID |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) UNIQUE | User's email address |
| password | TEXT | Bcrypt hashed password |
| role | VARCHAR(20) | `contributor` or `maintainer` (default: `contributor`) |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### `issues`

| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incremented ID |
| title | VARCHAR(150) | Issue title |
| description | TEXT | Issue description (min 20 chars) |
| type | VARCHAR(50) | `bug` or `feature_request` |
| status | VARCHAR(50) | `open`, `in_progress`, or `resolved` (default: `open`) |
| reporter_id | INTEGER | Foreign key → `users.id` |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get a single issue |
| POST | `/api/issues` | Contributor, Maintainer | Create a new issue |
| PATCH | `/api/issues/:id` | Contributor (own, open only), Maintainer (any) | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer | Delete an issue |

### Query Parameters — `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | (none) |
| `status` | `open`, `in_progress`, `resolved` | (none) |

**Example:**
```
GET /api/issues?sort=oldest&type=bug&status=open
```

---

## Auth Usage

Include the JWT token in the `Authorization` header:

```
Authorization: req.headers <your_token>
```

---

## Role Permissions

| Action | Contributor | Maintainer |
|---|---|---|
| Register / Login | ✅ | ✅ |
| View issues | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| Update own open issue | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Delete issue | ❌ | ✅ |

---

## Project Structure

```
src/
├── config/          # Environment config
├── db/              # PostgreSQL pool & DB init
├── middleware/      # authenticate, globalErrorHandler
├── modules/
│   ├── users/       # users controller, service, route
│   └── issues/      # issues controller, service, route
├── types/           # TypeScript types & Express augmentation
├── utils/           # AppError, sendResponse
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```
