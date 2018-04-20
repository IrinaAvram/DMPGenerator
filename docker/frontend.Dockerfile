FROM agileek/ionic-framework:latest
ADD Frontend /app
WORKDIR /app
RUN ["npm", "install"]
ENTRYPOINT ["ionic", "serve"]