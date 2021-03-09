FROM node:alpine

ADD package.json .

RUN npm i -s

CMD npm run serve