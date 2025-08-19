FROM node:23 AS build
WORKDIR /chemnitz-express
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:23 AS production

WORKDIR /chemnitz-express

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /chemnitz-express/node_modules ./node_modules
COPY --from=build /chemnitz-express/dist ./dist

CMD ["node", "dist/server.js"]