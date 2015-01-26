'use strict';

var
  http = require('http'),
  express = require('express'),
  routes = require('./routes'),
  app = express(),
  server = http.createServer(app),
  PORT = 8000;

// Setup middlewares ===========================
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.basicAuth('user', 'spa'));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.logger());
  app.use(express.errorHandler({
    dumpException: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Setup routings ==============================
routes.configRoutes(app, server);

server.listen(PORT);
console.log('Express server listening on port %d in %s mode',
    server.address().port, app.settings.env);
