FROM node:22.11-alpine3.20

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "run"]

CMD ["start"]
