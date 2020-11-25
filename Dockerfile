FROM node:12

WORKDIR /temp

COPY . .

RUN yarn

RUN FF_RELEASE=true node script/ci.js

