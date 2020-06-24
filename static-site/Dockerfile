FROM node:12-slim

RUN apt-get update && apt-get install -y wget

RUN npm i -g ghost-static-site-generator live-server

ENTRYPOINT ["gssg"]

WORKDIR /app
COPY run.sh .

ENTRYPOINT ["./run.sh"]
