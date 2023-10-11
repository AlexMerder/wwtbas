# Use the official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY *.json ./

# Install any needed packages specified in package.json
RUN npm install

# Run the application when the container launches
CMD ["node", "index.js"]