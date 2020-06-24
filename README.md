# serverless-ghost

The [Ghost](https://ghost.org/) project ported to AWS Lambda.

# Features
## Known to work
> Don't expect 100% feature parity yet!
- [x] Basic CRUD of posts and pages
- [x] Emails
- [x] CDN
- [x] Integration with Sentry (though they don't really advertise it)
- [x] Upload themes
- [x] Upload images and assets

## Additional features
`serverless-ghost` provides a few facilities:
- Easy deployment with Docker Compose.
- Generate static site.

## AWS integrations
The following are made possible/easier with `serverless-ghost`:
- Serve Ghost on your own domain (through Api Gateway).
- Creates a VPC dedicated to your Ghost installation.
- Free SSL certificates with Certificate Manager.
- Send emails with Amazon SES (e.g "forgot password" and welcome emails)
- Option to use regular Mysql or Aurora serverless
- Filesystem to host themes and other content with Amazon EFS
- Upload assets onto Amazon S3
- Deliver assets via Amazon CloudFront CDN
- Secure access to your database with VPC and tight security groups
- Automated IAM setup for Ghost to interact with the various services

# Deployment instructions

## TLDR
- Put your desired `DomainName` in [samconfig.toml](samconfig.toml)
- Run `docker-compose up deploy`
- Check output for how to validate your SSL certificate.
- Put the stack output `WebsiteDns` as CNAME in your dns settings
- Hit the `PingUrl` given in the stack output
- Access the blog at `https://${DomainName}`

## The details
I expanded on the above in the [deployment.md](deployment.md) file. There are explanations, screenshots and documented issues there.

# Licensing
Custom code provided in this repository is released under the [Simplified BSD Licence](LICENCE).

This project includes code Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved. See [LICENCE-SAMPLECODE](LICENCE-SAMPLECODE) for details.

Upstream project is Copyright (c) 2013-2020 Ghost Foundation. See [LICENCE-Ghost](LICENCE-Ghost) for details.
