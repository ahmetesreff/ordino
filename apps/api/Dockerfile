FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN npm run build --workspace=@ordino/database
RUN npm run build --workspace=@ordino/auth
RUN npm run build --workspace=api

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
RUN chmod +x apps/api/entrypoint.sh
EXPOSE 3000
CMD ["sh", "apps/api/entrypoint.sh"]
