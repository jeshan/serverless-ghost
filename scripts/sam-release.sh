#!/usr/bin/env sh
set -ex

bucket=jeshan-oss-public-files
prefix=serverless-ghost
output_file=template-packaged.yaml

sam package --s3-bucket ${bucket} --region us-east-1 --s3-prefix ${prefix} --output-template-file ${output_file}
aws s3 cp ${output_file} s3://${bucket}/${prefix}/template.yaml
