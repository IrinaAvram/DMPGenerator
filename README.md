# DMPGenerator
Website allowing an automatized Creation of Data Management Plans

## How to run the project

Execute the following commands while in the "DMPGenerator" folder to build the containers.
```bash
docker build -f docker/frontend.Dockerfile -t frontend .
docker build -f docker/frontend.Dockerfile -t backend .
```
*Docker files have been provided in the "docker" folder*.


Execute the following commands to start the docker containers (insert the ports you wish to have mapped to the container ports):
```bash
docker run -p <BACKEND_PORT>:8080 backend
docker run -p <FRONTEND_PORT>:4100 frontend
```
To use the tool open your favorite webbrowser and navigate to:


http://localhost:`<FRONTEND_PORT>`/
### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myBlank blank
```
