FROM ghost:3.20.1 as base

WORKDIR current/
RUN npm install

RUN npm install aws-serverless-express wait-until

RUN cd /tmp && npm install ghost-storage-adapter-s3

RUN mv /tmp/node_modules/ghost-storage-adapter-s3/ core/server/adapters/storage/s3/

FROM python:3.8-alpine

RUN apk add --no-cache gcc musl-dev patch zip

ENV SAM_CLI_TELEMETRY 0

WORKDIR /app

RUN pip3 install "aws-sam-cli<1" awscli

COPY --from=base /var/lib/ghost/versions/3.20.1/ src

RUN mkdir nodejs && mv src/node_modules nodejs/node_modules

# remove some unneeded files that make the package size exceed lambda limit
RUN rm -rf nodejs/node_modules/gscan/test/fixtures/ \
  nodejs/node_modules/sharp/vendor/lib/ \
  nodejs/node_modules/gscan/app/uploads && \

  find . -type f -name '*.map' -delete && \
  find . -type f -name '*.min.js' -delete && \
  find | grep test/ | xargs rm -rf && \
  find | grep tests/ | xargs rm -rf

RUN mkdir node-modules && mv nodejs node-modules/
RUN cd node-modules && zip -qr ../node-modules.zip *

COPY index.js.patch .
RUN patch src/index.js index.js.patch
RUN cd src/ && zip -qr ../src.zip *

COPY scripts scripts
COPY samconfig.toml vpc-privatepublic.yaml template.yaml ./
ENTRYPOINT ["scripts/sam-deploy.sh"]
