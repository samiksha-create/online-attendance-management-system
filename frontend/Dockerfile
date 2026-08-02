# frontend/Dockerfile
# Multi-stage build: compile the React (Vite) app, then serve it via Nginx

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Since we proxy /api/* through Nginx to the backend container (see nginx.conf),
# the frontend can call relative /api paths — no build-time API URL needed.
# Override with --build-arg VITE_API_URL=... if calling the backend directly instead.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
