#!/usr/bin/env bash

if [ "$(sudo docker ps -q -f name=frontend_container)" ]; then
    sudo docker stop frontend_container
    sudo docker rm frontend_container
fi

if [ "$(sudo docker ps -q -f name=backend_container)" ]; then
    sudo docker stop backend_container
    sudo docker rm backend_container
fi

if [ ! "$(sudo docker ps -q -f name=mysql_container)" ]; then
    sudo docker run --name mysql_container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookingsystem_db -d mysql:latest

    # workaround, we need to make sure the webapp starts only after the mysql instance is ready.
    sleep 120
fi

sudo docker run -p 8080:8080 --name backend_container --link mysql_container:localhost -d backend

sudo docker run -p 80:8100 --name frontend_container -e "NODE_ENV=$1" -d frontend