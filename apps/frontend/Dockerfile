FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm install

COPY apps/frontend ./apps/frontend

RUN npm run build -w apps/frontend

EXPOSE 3000

CMD ["npm", "start", "-w", "apps/frontend"]
