'Use strict';

var configRoutes;

configRoutes = function(app, server) {
  // Setup routings
  app.get('/', function(request, response) {
    response.redirect('/spa.html');
  });

  app.all('/api/1/:obj_type/*?', function(request, response, next) {
    response.contentType('json');
    next();
  });

  app.get('/api/1/:obj_type/list', function(request, response) {
    response.send({title: request.params.obj_type + ' list'});
  });

  app.post('/api/1/:obj_type/create', function(request, response) {
    response.send({title: request.params.obj_type + ' created'});
  });

  app.get('/api/1/:obj_type/read/:id([0-9]+)', function(request, response) {
    response.send({
      title: request.params.obj_type + ' found'
    });
  });

  app.post('/api/1/:obj_type/update/:id([0-9]+)', function(request, response) {
    response.send({
      title: request.params.obj_type + ' updated'
    });
  });

  app.get('/api/1/:obj_type/delete/:id([0-9]+)', function(request, response) {
    response.send({
      title: request.params.obj_type
        + ' with id ' + request.params.id + ' deleted'
    });
  });
};

module.exports = {configRoutes: configRoutes};
