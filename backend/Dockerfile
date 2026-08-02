# backend/Dockerfile
# Multi-stage build for a lean production Node.js image

# ---------- Stage 1: Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---------- Stage 2: Production Image ----------
FROM node:20-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove test files from production image (optional slimming)
RUN rm -rf tests

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

USER appuser

# Basic healthcheck hitting our /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode===200?0:1)).on('error', ()=>process.exit(1))"

CMD ["node", "server.js"]
