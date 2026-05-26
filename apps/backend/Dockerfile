FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm install

COPY apps/backend ./apps/backend

RUN npm run build -w apps/backend

EXPOSE 5000

CMD ["npm", "start", "-w", "apps/backend"]
