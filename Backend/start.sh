#!/bin/bash

# Run Prisma migrations
npx prisma migrate dev

npm run build
# Start the Node.js application
# npm run start:dev
npm run start