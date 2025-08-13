#FROM ubuntu:latest
#LABEL authors="mariiakatsala"
#
#ENTRYPOINT ["top", "-b"]
FROM node:23
WORKDIR /chemnitz-express
COPY package*.json ./
RUN npm install

#COPY src ./src
COPY . .

#CMD ["node", "src/app.ts"]
#CMD ["npm", "run", "build"]
#CMD ["npm", "start"]

CMD ["npm", "run", "dev"]
