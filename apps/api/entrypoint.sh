#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss

echo "Seeding database..."
npx ts-node packages/database/prisma/seed.ts

echo "Starting API server..."
exec npm run start:prod --workspace=api
