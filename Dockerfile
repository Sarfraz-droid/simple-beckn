FROM node:16

WORKDIR /app

COPY . .

ENV DOCKER=true

RUN yarn

EXPOSE 3001

CMD ["yarn", "dev:bap"]

