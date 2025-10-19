# Multi-stage build for full-stack app
FROM node:18-alpine AS frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/dist ./public

# Copy backend
COPY --from=backend /app ./backend

# Install serve for static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && npm start & serve -s public -l 3000"]
