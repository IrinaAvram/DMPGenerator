# DMPGenerator
Website allowing an automatized Creation of Data Management Plans

## How to run the project

Execute the following commands while in the "DMPGenerator" folder to build the containers.
```bash
docker build -f docker/frontend.Dockerfile -t frontend .
docker build -f docker/backend.Dockerfile -t backend .
```
*Docker files have been provided in the "docker" folder*.


Execute the following commands to start the docker containers:
```bash
docker run -p 8080:8080 backend
docker run -p 8100:8100 frontend
```
To use the tool open your favorite webbrowser and navigate to:

```bash
localhost:8100
```
