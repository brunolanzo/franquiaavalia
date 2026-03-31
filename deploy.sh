#!/bin/bash
set -e

echo "=== Franquia Avalia - Deploy Script ==="

# 1. Pull latest code
echo ">> Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo ">> Installing dependencies..."
npm ci --production=false

# 3. Generate Prisma client
echo ">> Generating Prisma client..."
npx prisma generate

# 4. Run database migrations
echo ">> Running database migrations..."
npx prisma migrate deploy

# 5. Build the application
echo ">> Building application..."
npm run build

# 6. Copy static files to standalone
echo ">> Copying static files..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true

# 7. Restart PM2 process
echo ">> Restarting PM2..."
pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js

echo "=== Deploy complete! ==="
