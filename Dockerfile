#FROM public.ecr.aws/docker/library/node:18.17.1-bullseye AS builder
FROM node:16.16.0-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

#FROM public.ecr.aws/docker/library/node:18.17.1-bullseye AS final
FROM node:16.16.0-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

EXPOSE 5000
ENV NODE_ENV production

CMD [ "yarn", "start" ]

# Path: .dockerignore

