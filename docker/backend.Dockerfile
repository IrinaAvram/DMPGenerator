FROM maven:latest
ADD Backend /app
WORKDIR /app
RUN ["mvn", "clean", "install"]
ENTRYPOINT ["java","-jar","target/Backend-1.0-SNAPSHOT.jar"]