"use strict";

var app = require('koa')();
var middlewares = require('koa-middlewares');
var config = require('./config');

var debug = require('debug')('api');
var Models = require('./models');

Models.init(function() {
  	app.use(function *(next) {
	  	try {
		    yield next;
	  	} catch (err) {
		    this.status = err.status || 500;
		    this.body = err.message;
		    this.app.emit('error', err, this);
	  	}
	});

	app.use(middlewares.bodyParser());
	app.use(middlewares.router(app, {
		prefix: config.route_prefix
	}));
	require('./routes')(app);

	// Start Server
	app.listen(config.port);
	debug('listening on ' + config.port);
});

