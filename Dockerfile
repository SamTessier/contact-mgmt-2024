# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of your application code
COPY . .

# Create a directory for credentials with proper permissions
RUN mkdir -p /app/credentials && chmod 777 /app

# Build the Remix app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Remix app
CMD ["npm", "start"]
