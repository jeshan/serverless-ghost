// # Ghost Startup
// Orchestrates the startup of Ghost when run from command line.

const startTime = Date.now();
const debug = require('ghost-ignition').debug('boot:index');
// Sentry must be initialised early on
const sentry = require('./core/shared/sentry');

debug('First requires...');
const waitUntil = require('wait-until');
const fs = require('fs-extra')

function copyCasperTheme() {
    let source = 'content/themes/casper';
    let destination = `${process.env["paths__contentPath"]}/themes/casper`;
    console.log(`copying ${source} to ${destination}`);
    fs.copySync(source, destination);
}

copyCasperTheme();
const ghost = require('./core');

debug('Required ghost');

const express = require('./core/shared/express');
const logging = require('./core/shared/logging');
const urlService = require('./core/frontend/services/url');
// This is what listen gets called on, it needs to be a full Express App
const ghostApp = express('ghost');

// Use the request handler at the top level
// @TODO: decide if this should be here or in parent App - should it come after request id mw?
ghostApp.use(sentry.requestHandler);

debug('Initialising Ghost');

let started = false;
ghost().then(function (ghostServer) {
    // Mount our Ghost instance on our desired subdirectory path if it exists.
    ghostApp.use(urlService.utils.getSubdir(), ghostServer.rootApp);

    debug('Starting Ghost');
    // Let Ghost handle starting our server instance.
    return ghostServer.start(ghostApp)
        .then(function afterStart() {
            logging.info('Ghost boot', (Date.now() - startTime) / 1000 + 's');
            started = true;
        });
}).catch(function (err) {
    logging.error(err);
    setTimeout(() => {
        process.exit(-1);
    }, 100);
});
const binaryMimeTypes = [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/x-icon',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml'
];
const awsServerlessExpress = require('aws-serverless-express');
let server = awsServerlessExpress.createServer(ghostApp, null, binaryMimeTypes);

exports.handler = (event, context) => {
    let fulfilRequest = () => {
        context.callbackWaitsForEmptyEventLoop = false;
        return awsServerlessExpress.proxy(server, event, context);
    };
    if (started) {
        return fulfilRequest();
    }
    // Site is starting up, waiting a second then retry.
    waitUntil()
        .interval(1000)
        .times(Infinity)
        .condition(() => {
            return started;
        })
        .done(fulfilRequest);
}
