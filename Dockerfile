FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies (including react-scripts)
RUN npm install --silent

# Copy application code
COPY . .

# Set proper permissions (do this before switching user)
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

EXPOSE 3000

# Start the development server
CMD ["npm", "start"]