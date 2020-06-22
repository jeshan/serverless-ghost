FROM ghost:3.20.1 as base

WORKDIR current/
RUN npm install

RUN npm install aws-serverless-express wait-until

RUN cd /tmp && npm install ghost-storage-adapter-s3

RUN mv /tmp/node_modules/ghost-storage-adapter-s3/ core/server/adapters/storage/s3/

FROM python:3.8-alpine

RUN apk add --no-cache gcc musl-dev zip

ENV SAM_CLI_TELEMETRY 0

WORKDIR /app

RUN pip3 install aws-sam-cli

COPY --from=base /var/lib/ghost/versions/3.20.1/ src

RUN mkdir nodejs && mv src/node_modules nodejs/node_modules

# SAM had trouble adding these to zip (they are symlinks)
RUN rm nodejs/node_modules/jsdom/node_modules/request/node_modules/.bin/uuid \
  nodejs/node_modules/node-loggly-bulk/node_modules/request/node_modules/.bin/uuid \
  nodejs/node_modules/.bin/prebuild-install

# remove some unneeded files that make the package size exceed lambda limit
RUN rm -rf nodejs/node_modules/gscan/test/fixtures/ \
  nodejs/node_modules/sharp/vendor/lib/ \
  nodejs/node_modules/gscan/app/uploads && \

  find . -type f -name '*.map' -delete && \
  find . -type f -name '*.min.js' -delete && \
  find | grep test/ | xargs rm -rf && \
  find | grep tests/ | xargs rm -rf

RUN mkdir node-modules && mv nodejs node-modules/
RUN cd node-modules && zip -r ../node-modules.zip *

COPY index.js src/
RUN cd src/ && zip -r ../src.zip *

COPY samconfig.toml vpc-privatepublic.yaml template.yaml ./
ENTRYPOINT ["sam", "deploy"]
