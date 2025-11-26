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

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy backend code
COPY server/ ./

# Copy built frontend to server public directory (or serve separately, but for simplicity we'll serve static)
# For this setup, we'll assume the server serves the static files or we run them separately.
# Given the constraints, a single container running both is efficient.
# Let's modify the server to serve the frontend build.

COPY --from=frontend-build /app/client/dist ./public

# Expose port
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start server
CMD ["node", "src/app.js"]
