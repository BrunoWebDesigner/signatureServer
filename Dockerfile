FROM node:20.16.0

WORKDIR .

COPY package*.json ./


RUN npm install

COPY index-exp.js ./

EXPOSE 3000

CMD ["node", "index-exp.js"]