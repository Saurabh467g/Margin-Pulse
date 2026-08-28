# Production Dockerfile for MarginPulse Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build both client and bundled backend (dist/server.cjs)
RUN npm run build

# Production Runner Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only production dependencies and built assets
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Expose container ingress port
EXPOSE 3000

# Start compiled server
CMD ["node", "dist/server.cjs"]
