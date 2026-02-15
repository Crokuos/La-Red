# Backend README (API de La Red)

Guía rápida para levantar un backend básico para La Red (API REST con Node.js + Express + PostgreSQL). Ajusta lo que necesites según tu stack preferido.

## 1. Stack sugerido
- Runtime: Node.js 20+
- Framework: Express
- DB: PostgreSQL 14+
- ORM: Prisma
- Auth: JWT (access + refresh)
- Uploads: S3-compatible (S3/MinIO); para dev, carpeta local
- Cache/RT: Redis (tokens de invalidación, rate limiting opcional)

## 2. Estructura propuesta
```
backend/
  src/
    index.ts            # bootstrap server
    config.ts           # env + settings
    db/                 # prisma client, seeds
    modules/
      auth/             # login, refresh, registro
      users/            # perfil, tribus, ubicación
      matches/          # likes, match, feed
      stories/          # historias (subida, listing, expire)
      uploads/          # firma S3 o storage local
    middleware/         # auth, error handler, rate limit
    utils/              # helpers (uuid, time, etc)
  prisma/
    schema.prisma
  package.json
  tsconfig.json
  .env.example
```

## 3. Variables de entorno (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/lared"
JWT_SECRET="cambia_esto"
JWT_REFRESH_SECRET="cambia_esto_tambien"
S3_ENDPOINT="http://localhost:9000"       # opcional
S3_REGION="us-east-1"
S3_BUCKET="lared-media"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
PORT=4000
```

## 4. Scripts (sugeridos en package.json)
```
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc -p .",
  "start": "node dist/index.js",
  "lint": "eslint .",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "seed": "ts-node prisma/seed.ts"
}
```

## 5. Modelos base (schema.prisma, resumen)
- User: id, email, hash, nombre, avatarUrl, depto, barrio, tribus (string[]), createdAt
- Match: id, userAId, userBId, createdAt
- Like: id, fromId, toId, createdAt
- Story: id, userId, mediaUrl, mediaType (image|video), expiresAt, createdAt
- RefreshToken: id, userId, token, revoked, createdAt

## 6. Endpoints mínimos
- Auth: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout
- Perfil: GET /me, PATCH /me (nombre, avatarUrl, tribus, depto, barrio)
- Feed/Users: GET /users?search=&depto=&tribus[]=... (paginado)
- Likes/Match: POST /likes/{userId}, GET /matches (solo matches confirmados)
- Stories: GET /stories (solo de matches + propias), POST /stories (subir media <1min), DELETE /stories/{id} (auto-expira 24h via cron/TTL)
- Uploads: POST /uploads/sign (firma S3) o POST /uploads (local)

## 7. Subida de historias (flujo)
1) Cliente pide firma: POST /uploads/sign con { mimeType }
2) Sube a S3 directamente.
3) Llama POST /stories con { mediaUrl, mediaType }
4) Backend setea expiresAt = now + 24h.

## 8. Reglas de negocio
- Solo puedes ver historias de matches o tuyas.
- Solo puedes enviar mensajes a matches (validación en gateway de chat, no incluido aquí).
- Máx 5 tribus por usuario; depto/barrio deben venir de catálogo controlado (validar server-side).

## 9. Seguridad
- CORS con whitelist.
- Rate limiting en /auth y /uploads.
- Passwords con bcrypt.
- JWT access corto (15m) + refresh largo (7d) con revocación en Redis/DB.

## 10. Pasos para levantar en local
```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma:migrate
pnpm dev
```

## 11. Tareas pendientes
- Definir catálogo de depto/barrio (usar el mismo que front).
- Implementar almacenamiento de media (S3/MinIO) y limpieza de historias expiradas (cron/TTL).
- Agregar tests básicos (Vitest/Jest) y lint.

## 12. Opcional
- WebSockets/SignalR/Supabase Realtime para chat y presencia.
- Observabilidad: pino + OpenTelemetry, healthcheck `/health`.
- CI: lint + test + prisma migrate diff.
