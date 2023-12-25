FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory

RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*

WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
# COPY yarn.lock .
# RUN yarn install
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]
