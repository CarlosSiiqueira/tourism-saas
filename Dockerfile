FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN npm install -g pm2
COPY . .
EXPOSE 8000 9229
CMD ["npm", "run", "dev:debug"]