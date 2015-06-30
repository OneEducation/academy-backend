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
  app.get('/item/verified_by/:id', ReportItem.get_by_verifiedBy);
  app.post('/verify', ReportItem.verify);
  app.post('/ignore/item/:id/by/:verifier_id', ReportItem.ignore);

  app.get('/points/:id', Common.reporterPoint);
  app.get('/points/verifier/:id', Common.verifierPoint);
  app.post('/register/verifier', Common.register);
  
  app.get('/app_intent', Common.getAppIntent);
  app.post('/app_intent', Common.setAppIntent);

  app.get('/courses', controllers.Course.get);
  app.post('/courses/refresh', controllers.Course.refresh);
};
