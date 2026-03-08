# Docker Setup

## Existing container ports checked before setup

At setup time, these host ports were already used by running containers:
- `3000` (web)
- `3001` (web)
- `5432` (postgres)

## Non-conflicting ports selected for this project

- Web (Next.js): `3100` -> container `3000`
- API (NestJS): `4100` -> container `4000`
- PostgreSQL: `55432` -> container `5432`

## Run

```bash
docker compose up -d --build
```

## Check

```bash
docker compose ps
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

## Stop

```bash
docker compose down
```

## Notes

- API currently uses in-memory game state; DB container is prepared for Prisma integration.
- `apps/api/src/main.ts` now reads `PORT` env variable.
