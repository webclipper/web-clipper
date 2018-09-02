FROM node:10.9.0-alpine as build

COPY . /source/
WORKDIR /source

RUN yarn && yarn lint && yarn test && yarn build
