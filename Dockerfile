FROM node:20-alpine AS base
WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/game-engine/package.json packages/game-engine/package.json

RUN npm install

COPY . .

FROM base AS api
WORKDIR /app
EXPOSE 4000
CMD ["npm", "--workspace", "@ait/api", "exec", "ts-node", "src/main.ts"]

FROM base AS web
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "--workspace", "@ait/web", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
