FROM public.ecr.aws/docker/library/node:18.17.1-bullseye AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM public.ecr.aws/docker/library/node:18.17.1-bullseye AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .
COPY global-bundle.pem .
RUN yarn install --production

EXPOSE 5000
ENV NODE_ENV production

CMD [ "yarn", "start" ]

# Path: .dockerignore

