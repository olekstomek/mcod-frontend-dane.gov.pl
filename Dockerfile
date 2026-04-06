# VERSIONS
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS dependencies

WORKDIR /usr/src/mcod

ADD ./package.json      ./
ADD ./package-lock.json ./

RUN npm install @angular/cli
RUN npm install

FROM node:${NODE_VERSION}-alpine AS build
ARG MCOD_BUILD_CONFIGURATION_ENV=int

WORKDIR /usr/src/mcod
COPY --from=dependencies /usr/src/mcod/node_modules ./node_modules

ADD ./src ./src

ADD ./angular.json ./
ADD ./package.json ./
ADD ./package-lock.json ./

ADD ./tsconfig.app.json ./
ADD ./tsconfig.json ./

# to check if this file is indeed used by autoprefixer
ADD ./.browserslistrc ./

RUN npm run build:${MCOD_BUILD_CONFIGURATION_ENV}

FROM nginx:alpine AS serve-static
# copy files for nginx
COPY --from=build /usr/src/mcod/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80

# copy files to the location used in the deployment
# see rancher->nginx->spec.initContainers[0].command
# nginx container runs:
# cp -r dist/frontend/ /dist
# So we need to copy the build files to somewhere that's not /dist
WORKDIR /usr/src/mcod
RUN mkdir -p dist
COPY --from=build /usr/src/mcod/dist/frontend/browser dist/frontend/

FROM node:${NODE_VERSION}-alpine AS serve-dynamic
ARG MCOD_PORT=4000

WORKDIR /usr/src/mcod
COPY --from=dependencies /usr/src/mcod/node_modules ./node_modules

ADD ./proxy.dev.conf.json ./
ADD ./proxy.int.conf.json ./
ADD ./proxy.local.conf.json ./
ADD ./proxy.preprod.conf.json ./

ENV MCOD_SERVE_CONFIGURATION_ENV=local
ENV MCOD_PROXY_CONFIG_FILE=proxy.local.conf.json
ENV MCOD_PORT=${MCOD_PORT}

EXPOSE ${MCOD_PORT}

ADD ./docker/entrypoint-ngserve.sh /usr/bin/entrypoint-ngserve
RUN chmod +x /usr/bin/entrypoint-ngserve
ENTRYPOINT ["/usr/bin/entrypoint-ngserve"]
