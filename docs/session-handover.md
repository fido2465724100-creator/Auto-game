# Session Handover: Auto-game

Цей документ містить короткий підсумок усіх виконаних робіт, щоб продовжити розробку на іншому комп'ютері.

## 1. Що було вхідними даними

- `project_brief.md` — повний бриф гри Auto Industry Tycoon.
- `phases.md` — сформульований Phase 1 план.
- `rules.md` — правила розробки.

## 2. Що реалізовано (Phase 1)

Створено основу проєкту як monorepo:

- `apps/web` (Next.js)
- `apps/api` (NestJS)
- `packages/shared-types` (спільні типи)
- `packages/game-engine` (бізнес-симуляція)
- `data/*` (seed-дані)
- `prisma/schema.prisma`
- `docs/*` (документація)

### Доменні моделі

Реалізовані shared типи:
- Company
- GameState
- Technology
- ResearchProject
- VehicleModel
- Region
- HistoricalEvent
- MonthlyReport

Файл: `packages/shared-types/src/index.ts`

### Симуляція ходу

Реалізовано в `packages/game-engine/src/index.ts`:
- advance на 1 місяць
- progress research
- unlock completed technologies
- sales by region/model
- finances (revenue/expenses/profit)
- monthly report generation

### Backend API

Ендпоїнти (`apps/api/src/game/game.controller.ts`):
- `GET /game/state`
- `GET /game/regions`
- `GET /game/technologies`
- `POST /game/research/start`
- `POST /game/vehicles`
- `PATCH /game/production`
- `POST /game/end-turn`

### Frontend сторінки

Створено мінімальні сторінки:
- `/dashboard`
- `/research`
- `/vehicle-design`
- `/markets`
- `/reports`

## 3. Docker налаштування

Створено:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.env.docker`
- `docs/docker-setup.md`

### Вибрані порти (без конфліктів)

- Web: `3100 -> 3000`
- API: `4100 -> 4000`
- DB: `55432 -> 5432`

Причина: у системі вже були зайняті `3000`, `3001`, `5432`.

### Важливий фікс API контейнера

Було виправлено запуск API в Docker (помилка `Cannot find module /app/apps/api/dist/main`):
- у `Dockerfile` для `api` використано `ts-node src/main.ts`.

## 4. GitHub та гілка DEV

### Зроблено

- Ініціалізовано git-репозиторій локально.
- Створено гілку `DEV`.
- Додано remote:
  - `git@github.com:fido2465724100-creator/Auto-game.git`
- Налаштовано SSH-ключ для push:
  - `.keys/github_auto_game_ed25519`
  - `.keys/` додано в `.gitignore`

### Push виконано в DEV

Ключові коміти в `DEV`:
- `a6133a9` — scaffold phase 1 MVP + docker setup
- `4845814` — ignore local ssh keys
- `45b7c39` — fix mixed-content API calls on hosted web
- `a022951` — docs: new machine setup playbook

## 5. Виправлена помилка на хостингу (Render)

Проблема:
- web (HTTPS) звертався до `http://localhost:4000` -> браузер блокував mixed content.

Виправлення:
- `apps/web/lib/api.ts`:
  - якщо `NEXT_PUBLIC_API_URL` задано — використовує його;
  - якщо ні, у браузері бере `window.location.origin`;
  - `localhost:4000` лишено лише як SSR/local fallback.

Документація:
- `docs/render-deploy.md`

Для Render потрібно встановити:
- `NEXT_PUBLIC_API_URL=https://<your-api>.onrender.com`

## 6. Документи, створені під час сесії

- `docs/phase-1-foundation.md`
- `docs/docker-setup.md`
- `docs/render-deploy.md`
- `docs/new-machine-setup.md`
- `docs/session-handover.md` (цей файл)

## 7. Поточний стан

- Базовий MVP foundation зібраний.
- Docker стек піднімається.
- GitHub `DEV` актуалізовано.
- Основна помилка хостингу (mixed content) виправлена.

## 8. Що робити далі

1. На новому ПК пройти `docs/new-machine-setup.md`.
2. Після клону і запуску перевірити:
   - `http://localhost:3100`
   - `http://localhost:4100/game/state`
3. Наступний технічний крок у розробці:
   - замінити in-memory store в API на Prisma persistence.
