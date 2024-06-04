FROM node:20

RUN npm install -g npm@10.5.1

WORKDIR /trans

COPY . .

RUN npm install

EXPOSE 3001

COPY ./start.sh .

RUN chmod +x ./start.sh

CMD ["./start.sh"]