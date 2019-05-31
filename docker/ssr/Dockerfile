FROM node:8-alpine

WORKDIR /usr/src/app

COPY *.json ./
COPY src ./src
COPY ./*.ts ./
COPY ./*.js ./

# CMD [ "npm", "i", "npm@latest", "-g" ]
# CMD [ "npm", "install" ]
RUN npm i npm@5.6.0 -g
RUN npm install --loglevel notice
RUN npm run build:ssr


EXPOSE 4000
#CMD [ "npm", "run build:ssr" ]
CMD [ "npm", "run", "serve:ssr" ]
