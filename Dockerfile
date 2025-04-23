FROM node:21-alpine as serverbuilder
WORKDIR /app/server/server
COPY ./server/ .
WORKDIR /app/server
COPY ./package.json ./
COPY ./scripts/ ./scripts
RUN ./scripts/validate_server.sh ./server/
RUN npm run build-server

FROM node:21-alpine as clientbuilder
WORKDIR /app/client/client
COPY ./client/package*.json ./
RUN npm i --ci
COPY ./client/ .
WORKDIR /app/client/server
COPY ./server/ .
WORKDIR /app/client/
COPY ./package.json ./
COPY ./scripts/ ./scripts
RUN npm run build-client


FROM tomsik68/xampp:8
RUN mkdir -p /opt/lampp/htdocs/~chenp102/
RUN ln -s /www /opt/lampp/htdocs/~chenp102/team
COPY ./server_setup/ /setup
RUN /opt/lampp/bin/mysql.server start && \
    /opt/lampp/bin/mysql < /setup/create_database.sql &&\
    /opt/lampp/bin/mysql -u chenp102_local -ppassword < /setup/create_tables.sql
COPY ./server_setup/.htaccess /www/

COPY --from=clientbuilder /app/client/dist/client /www
COPY --from=serverbuilder /app/server/dist/server /www/api

EXPOSE 80
