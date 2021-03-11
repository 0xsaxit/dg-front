FROM node:14.16.0-alpine3.13 as base
LABEL website="Secure Docker Images https://secureimages.dev"
LABEL description="We secure your business from scratch"
LABEL maintainer="support@secureimages.dev"

ARG CI=true
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NODE_ENV="production"

RUN apk add --no-cache ca-certificates git build-base python2 &&\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm audit --audit-level=high

RUN npm install --production --no-fund

# web3 1.3.4 affected https://www.npmjs.com/advisories/877/versions , so we use 1.3.4-rc.2
RUN npm outdated || true

COPY . .

RUN npm run build

# CMD ["sleep", "3d"]
################################################################################

FROM node:14.16.0-alpine3.13 as runtime
LABEL website="Secure Docker Images https://secureimages.dev"
LABEL description="We secure your business from scratch"
LABEL maintainer="support@secureimages.dev"

ENV NODE_ENV=production \
    PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

WORKDIR /app

COPY --from=base --chown=node:node /app .

USER node

CMD ["next", "start", "-p", "3000"]
