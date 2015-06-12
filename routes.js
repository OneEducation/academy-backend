'use strict';

var debug = require('debug')('routes');
var controllers = require('./controllers');
var Report = controllers.Report;
var ReportItem = controllers.ReportItem;
var Common = controllers.Common;

module.exports = function routes(app) {

  app.post('/report', Report.create);

  app.get('/item/verifier/:id', ReportItem.get_by_verifier);
  app.get('/item/reporter/:id', ReportItem.get_by_reporter);
  app.post('/verify', ReportItem.verify);
  app.post('/ignore/item/:id/by/:verifier_id', ReportItem.ignore);

  app.get('/points/:id', Common.calculatePoint);
  app.post('/register/verifier', Common.register);
};
