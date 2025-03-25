FROM node:21-alpine as clientbuilder
WORKDIR /app/client

COPY ./client/package*.json ./
RUN npm i --ci
COPY ./client/ .
RUN npm run build

FROM tomsik68/xampp:8
COPY --from=clientbuilder /app/client/dist /www
run mkdir -p /opt/lampp/htdocs/~chenp102/
run ln -s /www /opt/lampp/htdocs/~chenp102/team

EXPOSE 80
