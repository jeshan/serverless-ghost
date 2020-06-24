#!/usr/bin/env sh
bucket=`python scripts/get_bucket.py`
sam deploy --s3-bucket ${bucket} --region ${AWS_DEFAULT_REGION} --stack-name ${STACK_NAME}
