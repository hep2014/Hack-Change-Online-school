# Development image
FROM node:20 AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Открываем порт Vite (5173)
EXPOSE 5173

# Запускаем Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
