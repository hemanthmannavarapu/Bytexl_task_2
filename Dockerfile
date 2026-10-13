# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend2
COPY frontend2/package*.json ./
RUN npm ci
COPY frontend2/ ./
RUN npm run build

# Stage 2: Production Server (Node.js + Express serving API & Frontend)
FROM node:20-alpine
WORKDIR /app

COPY backend2/package*.json ./
RUN npm ci --only=production

COPY backend2/ ./

# Copy built React frontend assets into public folder
COPY --from=build-frontend /app/frontend2/dist ./public

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["npm", "start"]
