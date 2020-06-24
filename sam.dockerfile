FROM python:3.8-alpine

RUN apk add --no-cache gcc musl-dev

ENV SAM_CLI_TELEMETRY 0

WORKDIR /app

RUN pip3 install aws-sam-cli<1"

COPY template.yaml samconfig.toml ./

ENTRYPOINT ["sam"]
