#!/usr/bin/env bash
sudo docker stop backend_container
sudo docker rm backend_container
sudo docker stop mysql_container
sudo docker rm mysql_container
sudo docker build -f Dockerfile -t backend .
sudo docker run -p 3306:3306 --name mysql_container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bookingsystem_db -d mysql:latest
sleep 60
sudo docker run -p 8080:8080 --name backend_container --link mysql_container:localhost backend