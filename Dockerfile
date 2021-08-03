FROM node:14.16.1-alpine3.13 as base
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

COPY package*.json yarn.lock ./

RUN yarn audit --level critical || true

RUN yarn install --production

RUN yarn outdated || true

COPY . .

RUN yarn run build

# CMD ["sleep", "3d"]
################################################################################

FROM node:14.16.1-alpine3.13 as runtime
LABEL website="Secure Docker Images https://secureimages.dev"
LABEL description="We secure your business from scratch"
LABEL maintainer="support@secureimages.dev"

ENV NODE_ENV=production \
    PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

WORKDIR /app

COPY --from=base --chown=node:node /app .

USER node

CMD ["next", "start", "-p", "3000"]
