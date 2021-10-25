const express = require('express');
const cors = require('cors');
const argv = require('minimist')(process.argv.slice(2));


const routes = require('./routes');
const app = express();
require('./config/initialize');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use(cors());
app.use('/api/v1', routes);

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 1337;

// Start your app.
app.listen(3001, () => {
    console.log('listening on port 3001');
  });

app.listen(port, host, (err) => {
  if (err) {
    console.log('err: ', err);
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});