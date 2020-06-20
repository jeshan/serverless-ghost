#!/usr/bin/env python3

import hmac
import hashlib
import base64
import argparse

# Values that are required to calculate the signature. These values should
# never change.
DATE = "11111111"
SERVICE = "ses"
MESSAGE = "SendRawEmail"
TERMINAL = "aws4_request"
VERSION = 0x04

def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()

def calculateKey(secretAccessKey, region):
    signature = sign(("AWS4" + secretAccessKey).encode('utf-8'), DATE)
    signature = sign(signature, region)
    signature = sign(signature, SERVICE)
    signature = sign(signature, TERMINAL)
    signature = sign(signature, MESSAGE)
    signatureAndVersion = bytes([VERSION]) + signature
    smtpPassword = base64.b64encode(signatureAndVersion)
    print('Use this as SES password: ' + smtpPassword.decode('utf-8'))

def main():
    parser = argparse.ArgumentParser(description='Convert a Secret Access Key for an IAM user to an SMTP password.')
    parser.add_argument('--secret',
                        help='The Secret Access Key that you want to convert.',
                        required=True,
                        action="store")
    parser.add_argument('--region',
                        help='The name of the AWS Region that the SMTP password will be used in.',
                        required=True,
                        choices=['us-east-1','us-west-2','ap-south-1','ap-southeast-2','ca-central-1','eu-central-1','eu-west-1','eu-west-2','sa-east-1','us-gov-west-1'],
                        action="store")
    args = parser.parse_args()

    calculateKey(args.secret,args.region)

main()
