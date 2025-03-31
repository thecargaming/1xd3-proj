FROM node:21-alpine as clientbuilder
WORKDIR /app/client

COPY ./client/package*.json ./
RUN npm i --ci
COPY ./client/ .
RUN npm run build

FROM tomsik68/xampp:8
COPY --from=clientbuilder /app/client/out /www
RUN mkdir -p /opt/lampp/htdocs/~chenp102/
RUN ln -s /www /opt/lampp/htdocs/~chenp102/team
COPY ./server/ /www/api

COPY ./server_setup/ /setup
RUN /opt/lampp/bin/mysql.server start && \
    /opt/lampp/bin/mysql < /setup/create_database.sql &&\
    /opt/lampp/bin/mysql -u chenp102_local -ppassword < /setup/create_tables.sql
COPY ./server_setup/.htaccess /www/

EXPOSE 80
