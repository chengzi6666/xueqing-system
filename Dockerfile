FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy all source code
COPY . .

# Run prepare script
RUN npm run prepare

# Expose port (Railway uses PORT env var)
EXPOSE 3000

# Start server
CMD ["node", "server/server.js"]
