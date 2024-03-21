FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json app.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your Express app is running on
EXPOSE 3000

# Create a non-root user and switch to it
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser \
    && chown -R nodeuser:nodeuser /usr/src/app

USER nodeuser

# Start the Express application
CMD ["node", "app.js"]
