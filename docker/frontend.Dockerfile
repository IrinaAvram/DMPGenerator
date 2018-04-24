FROM agileek/ionic-framework:latest
ADD Frontend /app
WORKDIR /app
RUN ["npm", "install"]
RUN ["npm", "rebuild", "node-sass", "--force"]
ENTRYPOINT ["ionic", "serve"]