# Build stage for frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install build dependencies for node-llama-cpp (python, make, g++)
RUN apk add --no-cache python3 make g++

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy backend code
COPY server/ ./

# Create models directory
RUN mkdir -p models

# Copy built frontend to server public directory
COPY --from=frontend-build /app/client/dist ./public

# Expose port
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start server
CMD ["node", "src/app.js"]
