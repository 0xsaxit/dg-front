FROM node:14.15.2-alpine3.12 as base

ARG CI=true
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN apk add --no-cache ca-certificates git build-base python2 ;\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

#RUN npm audit

RUN npm install --production --no-fund

# web3 1.3.0 affected https://www.npmjs.com/advisories/877/versions , so we use 1.3.0-rc.0
RUN npm outdated || true

COPY . .

#COPY --from=decentralgames/website:latest /app/.next/cache /app/.next/cache

RUN npm run build
#RUN npm test

################################################################################

FROM node:14.15.2-alpine3.12 as runtime
LABEL maintainer="Sviatoslav <sviatoslav@uadevops.com>"

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

ENV NODE_ENV="production"
ENV PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

COPY --from=base --chown=node:node /app .

USER node

CMD ["next", "start", "-p", "3000"]
