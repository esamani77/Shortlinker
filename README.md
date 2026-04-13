# Shortlinker

A small **URL shortener backend**: users sign up, log in with JWT, create short codes for long URLs, resolve them, list their links, and delete their own entries. There is **no web UI** in this repo—clients talk to a JSON **REST API** only.

## Stack

| Layer | Technology |
|--------|------------|
| Runtime & language | **Node.js**, **TypeScript** |
| HTTP | **Express 5** |
| Database | **PostgreSQL** |
| ORM | **Prisma 7** (client generated to `generated/prisma`, **pg** driver via `@prisma/adapter-pg`) |
| Validation | **Zod** |
| Auth | **jsonwebtoken** (Bearer tokens), passwords hashed with salt (`lib/encription.ts`) |
| IDs / short codes | **nanoid** (default 6-character codes when not provided) |
| Dev | **tsx** (watch), **TypeScript** compiler |
| Logging | **morgan** |
| CORS | **cors** |

## API surface (routes)

Base URL assumes the server listens on port **8080** (see `src/server.ts`).

### Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|---------------|
| `GET` | `/api/users` | Optional | List users (id, email, timestamps; no passwords) |
| `POST` | `/api/users/signup` | No | Register (`email`, `password`, optional `name`) |
| `POST` | `/api/users/login` | No | Login; returns JWT |
| `GET` | `/api/users/urls` | **Yes** (Bearer) | List short links for the authenticated user |

### URLs — `/api/url`

| Method | Path | Auth | Description |
|--------|------|------|---------------|
| `POST` | `/api/url/create` | **Yes** | Create a short link (`url`, optional `shortUrl`) |
| `GET` | `/api/url/:shortUrl` | No | Look up a link by short code (JSON body, not HTTP redirect) |
| `DELETE` | `/api/url/:shortUrl` | **Yes** | Delete if the link belongs to the user |

Protected routes expect: `Authorization: Bearer <token>`.

## Project structure

```
shortlinker/
├── src/
│   ├── index.ts          # App bootstrap: mounts routes, starts server
│   └── server.ts         # Express app: CORS, JSON, morgan, optional JWT middleware
├── routes/
│   ├── user.routes.ts    # User CRUD-ish + signup/login + /urls
│   └── url.routes.ts     # Create, get by short code, delete
├── middlewares/
│   ├── auth.middlewares.ts    # Attach user from JWT; require login helper
│   └── validations.middlewares.ts  # Zod body validation
├── services/
│   ├── user.services.ts  # User DB helpers
│   └── url.services.ts   # Link DB helpers
├── validations/
│   ├── users.validations.ts
│   └── url.validations.ts
├── lib/
│   ├── prisma.ts         # Prisma client + PostgreSQL adapter
│   └── encription.ts     # Password hashing (salt + hash)
├── prisma/
│   └── schema.prisma     # User + Link models
├── generated/prisma/     # Generated Prisma client (do not edit by hand)
├── types/
│   └── express.d.ts      # Express `req.user` typing
├── package.json
└── tsconfig (as configured) / build output
```

## Prerequisites

- **Node.js** (version compatible with your TypeScript toolchain)
- **pnpm** (see `packageManager` in `package.json`)
- **PostgreSQL** and a connection string

## Environment

Create a `.env` (not committed) with at least:

- `DATABASE_URL` — PostgreSQL connection string for Prisma
- `JWT_SECRET` — secret used to sign and verify login tokens

## Setup

```bash
cd shortlinker
pnpm install
# Set DATABASE_URL and JWT_SECRET in .env
pnpm exec prisma migrate dev   # or prisma db push, depending on your workflow
pnpm run build                 # optional: compile TypeScript
pnpm run dev                   # tsx watch src/index.ts
```

The dev server logs `hi from port: 8080` when listening.

## Scripts

| Script | Command |
|--------|---------|
| `dev` | `tsx watch src/index.ts` |
| `build` | `tsc --build` |

---

*This README describes the repository as of the current layout: backend API only, no separate frontend “pages” in this project.*
