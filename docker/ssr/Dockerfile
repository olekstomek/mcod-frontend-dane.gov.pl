FROM node:12-alpine
ENV WORKERS=1

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY ./ssr-pm2-ecosystem.yml ./
COPY ./dist/frontend/ ./dist/frontend/

EXPOSE 4000

CMD ["sh", "-c", "pm2-runtime -i ${WORKERS} dist/frontend/server/main.js"]
