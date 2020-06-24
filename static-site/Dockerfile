FROM node:12-slim

RUN apt-get update && apt-get install -y wget

RUN npm i -g ghost-static-site-generator live-server

ENTRYPOINT ["gssg"]

ARG GHOST_HOME_PAGE=$GHOST_HOME_PAGE
ARG STATIC_SITE_HOME_PAGE=$STATIC_SITE_HOME_PAGE

RUN gssg --domain $GHOST_HOME_PAGE --url $STATIC_SITE_HOME_PAGE

WORKDIR static/

ENTRYPOINT ["live-server"]
