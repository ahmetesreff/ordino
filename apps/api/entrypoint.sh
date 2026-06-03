#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss

echo "Seeding database..."
npm run db:seed --workspace=@ordino/database || echo "Seeding skipped (already seeded or failed) — continuing."

echo "Starting API server..."
exec npm run start:prod --workspace=api
