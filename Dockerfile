FROM node:21-alpine as serverbuilder
WORKDIR /app
COPY ./server/ ./server
COPY ./package.json ./
RUN npm run build-server

FROM node:21-alpine as clientbuilder
WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm i --ci
COPY ./client/ .
WORKDIR /app
COPY ./package.json ./
RUN npm run build-client

FROM node:21-alpine as testrunner
WORKDIR /app/
COPY ./server/ ./server
COPY ./client/ ./client
COPY ./scripts/ ./scripts
COPY ./package.json ./
RUN npm run test
RUN touch ./package.json

FROM tomsik68/xampp:8
RUN mkdir -p /opt/lampp/htdocs/~chenp102/
RUN ln -s /www /opt/lampp/htdocs/~chenp102/team
COPY ./server_setup/ /setup
RUN /opt/lampp/bin/mysql.server start && \
    /opt/lampp/bin/mysql < /setup/create_database.sql &&\
    /opt/lampp/bin/mysql -u chenp102_local -ppassword < /setup/create_tables.sql
COPY ./server_setup/.htaccess /www/

COPY --from=clientbuilder /app/dist/client /www
COPY --from=serverbuilder /app/dist/server /www/api
# hack to always run tests
COPY --from=testrunner /app/package.json /setup
RUN rm -r /setup

EXPOSE 80
