FROM node:18.17.1-slim AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18.17.1-slim AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .
COPY .env.production .
RUN yarn install --production

EXPOSE 5000
ENV NODE_ENV production

CMD [ "yarn", "start" ]