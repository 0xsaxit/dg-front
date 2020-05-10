FROM node:14.2.0-alpine3.11 as build

ARG CI=true

RUN apk add --no-cache ca-certificates git build-base python2 ;\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm audit

RUN npm install --production --no-fund

# web3 1.2.8 affected https://www.npmjs.com/advisories/877/versions , so we use 1.2.8-rc.0
RUN npm outdated || true

COPY . .
RUN npm run build
#RUN npm test

FROM node:14.2.0-alpine3.11
LABEL maintainer="Sviatoslav <sviatoslav@uadevops.com>"

WORKDIR /app

ENV NODE_ENV="production"
ENV PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

COPY --from=build /app .

USER node

CMD ["next", "start", "-p", "3000"]
