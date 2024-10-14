FROM --platform=linux/amd64 node:18-alpine

# Install dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    fontconfig \
    ttf-freefont \
    && apk add --no-cache --virtual .build-deps \
    build-base \
    python3

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 8000 9229

CMD ["npm", "run", "dev:debug"]