FROM node:22-alpine AS build

RUN mkdir -p /home/node/wasb-front/node_modules && chown -R node:node /home/node/wasb-front
RUN npm install -g npm@latest

WORKDIR /home/node/wasb-front

COPY package*.json ./

RUN npm install

USER node
COPY --chown=node:node . .
RUN npm run build

FROM node:22-alpine AS development
WORKDIR /home/node/wasb-front

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM nginx:stable-alpine AS production
COPY --from=build /home/node/wasb-front/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]