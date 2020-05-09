FROM node:13.13.0-alpine3.11 as build

ARG CI=true

RUN apk add --no-cache ca-certificates git build-base python2 ;\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm audit
RUN npm install --production

COPY . .
RUN npm run build
#RUN npm test

FROM node:13.13.0-alpine3.11
LABEL maintainer="Sviatoslav <sviatoslav@uadevops.com>"

WORKDIR /app

ENV NODE_ENV="production"
ENV PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

COPY --from=build /app .

USER node

CMD ["next", "start", "-p", "3000"]
