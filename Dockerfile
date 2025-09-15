FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies with proper permissions
RUN npm install

# Copy application code
COPY . .

# Set correct permissions for node_modules and cache directories
RUN mkdir -p /usr/src/app/node_modules/.cache && \
    chown -R node:node /usr/src/app

# Switch to non-root user
USER node

EXPOSE 3000

CMD ["npm", "start"]