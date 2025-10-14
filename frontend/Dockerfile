FROM node:20-alpine3.21

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
  && npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
