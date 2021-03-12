FROM node:14

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]