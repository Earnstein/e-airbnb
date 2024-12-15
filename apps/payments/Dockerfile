FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm


COPY tsconfig.json nest-cli.json ./
COPY apps/payments apps/payments
COPY libs libs

RUN pnpm install --frozen-lockfile
RUN pnpm run build payments


FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]

