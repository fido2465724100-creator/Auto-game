# Phase 1 Foundation (Implemented)

## 1) Folder structure proposal

```text
/apps
  /web                 # Next.js UI
  /api                 # NestJS API
/packages
  /shared-types        # Shared domain types/contracts
  /game-engine         # Pure simulation logic
/data
  /regions             # Seed content
  /technologies
  /events
  /vehicle-components
/prisma                # Persistence schema
/docs                  # Phase documentation
```

## 2) MVP domain models (TypeScript)

Implemented in `packages/shared-types/src/index.ts`:
- `Company`
- `GameState`
- `Technology`
- `ResearchProject`
- `VehicleModel`
- `Region`
- `HistoricalEvent`
- `MonthlyReport`
- plus shared enums/type aliases and `EndTurnInput` / `EndTurnOutput`

## 3) Prisma schema proposal

Implemented in `prisma/schema.prisma`.

Persistence coverage:
- company + game state
- research projects
- vehicle models
- reports history
- technologies / regions / historical events

Notes:
- uses JSON for flexible substructures (`effects`, `stats`, `components`, `salesByRegion`, etc.)
- suitable for early MVP tuning before deeper normalization

## 4) Seed data structures

Implemented:
- `data/regions/regions.ts`
- `data/technologies/technologies-1900-1915.ts`
- `data/events/events.ts`
- `data/vehicle-components/components.ts`
- `data/index.ts`

## 5) Backend simulation flow (v1)

Implemented in `packages/game-engine/src/index.ts` and wired in API service.

Flow:
1. advance one month
2. progress active research
3. unlock completed technologies
4. simulate demand/sales by model and region
5. calculate revenue/expenses/profit
6. update cash and reputation
7. generate monthly report

## 6) Minimal frontend pages

Implemented pages:
- `apps/web/app/dashboard/page.tsx`
- `apps/web/app/research/page.tsx`
- `apps/web/app/vehicle-design/page.tsx`
- `apps/web/app/markets/page.tsx`
- `apps/web/app/reports/page.tsx`

Shared frontend pieces:
- `apps/web/lib/api.ts`
- `apps/web/components/nav.tsx`
- `apps/web/app/layout.tsx`

## 7) File-by-file map with purpose

### Root
- `package.json`: workspace scripts for web/api.
- `tsconfig.base.json`: strict TS config + path aliases.

### Shared contracts
- `packages/shared-types/src/index.ts`: canonical domain interfaces and simulation I/O contracts.

### Shared engine
- `packages/game-engine/src/index.ts`: deterministic `runEndTurn` pure simulation logic.

### Backend
- `apps/api/src/main.ts`: Nest bootstrap + validation + CORS.
- `apps/api/src/app/app.module.ts`: root module.
- `apps/api/src/game/game.module.ts`: game feature module.
- `apps/api/src/game/game.controller.ts`: endpoints.
- `apps/api/src/game/game.service.ts`: state orchestration and integration with engine.
- `apps/api/src/game/dto.ts`: request DTO validation.

### Frontend
- `apps/web/app/layout.tsx`: global shell + navigation.
- `apps/web/app/dashboard/page.tsx`: KPI overview and End Turn action.
- `apps/web/app/research/page.tsx`: technologies list + start research action.
- `apps/web/app/vehicle-design/page.tsx`: minimal model save flow.
- `apps/web/app/markets/page.tsx`: region demand context view.
- `apps/web/app/reports/page.tsx`: monthly report history view.
- `apps/web/lib/api.ts`: typed fetch wrapper for API calls.

### Data and DB
- `data/**`: externalized seed content.
- `prisma/schema.prisma`: MVP database model.

## Current TODOs
- replace in-memory API store with Prisma persistence
- add unit tests for formulas and end-turn flow
- make vehicle builder truly interactive from component seed data
- add production plan UI editing
