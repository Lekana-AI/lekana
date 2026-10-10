# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for building and Prisma)
RUN npm ci

# Copy the Prisma schema directory
COPY prisma ./prisma/

# Generate the Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
