FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
COPY . .

RUN yarn
RUN yarn build

# Bundle app source

EXPOSE 8080
CMD [ "yarn", "start" ]