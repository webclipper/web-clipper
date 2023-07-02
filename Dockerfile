FROM node:16

WORKDIR /temp

COPY . .

RUN yarn

RUN TARGET_BROWSER=Firefox PUBLISH_TO_STORE=true yarn ts-node script/release.ts

