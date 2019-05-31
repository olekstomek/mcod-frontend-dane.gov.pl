FROM node:8

ARG UID=1000
ARG GID=1000
ARG UNAME=mcod

WORKDIR /opt/mcod
ADD . /opt/mcod

RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

ADD ./docker/frontend/local/local-proxy.conf.json /opt/mcod/local-proxy.conf.json

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 8081

CMD ng serve --host 0.0.0.0 --port 8081 --aot=false --vendorChunk=true --disableHostCheck=true --prod=true
