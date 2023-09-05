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
COPY global-bundle.pem .
RUN yarn install --production

# # Install necessary dependencies and download the amazon-ssm-agent package
# RUN apt-get update && apt-get install -y \
#     wget \
#     && rm -rf /var/lib/apt/lists/* \
#     && wget https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/debian_amd64/amazon-ssm-agent.deb

# # Install the amazon-ssm-agent package
# RUN dpkg -i amazon-ssm-agent.deb && rm amazon-ssm-agent.deb

EXPOSE 5000
ENV NODE_ENV production

CMD [ "yarn", "start" ]

