# DB Export Service Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the service port
EXPOSE 4005

# Set environment variable defaults
ENV NODE_ENV=production
ENV PORT=4005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4005/health || exit 1

# Start the service
CMD ["node", "server.js"]
