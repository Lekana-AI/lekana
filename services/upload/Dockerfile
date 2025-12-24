FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 4001

# Set environment
ENV NODE_ENV=production
ENV PORT=4001

# Start the service
CMD ["node", "server.js"]
