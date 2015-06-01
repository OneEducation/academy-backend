'use strict';

var debug = require('debug')('routes');
var controllers = require('./controllers');
var Report = controllers.Report;
var ReportItem = controllers.ReportItem;
var Common = controllers.Common;

module.exports = function routes(app) {

  app.post('/report', Report.create);
  app.get('/report/verifier/:id', Report.get_by_verifier);
  app.get('/report/reporter/:id', Report.get_by_reporter);
  app.post('/report/verify/:id/verified_by/:verifier_id', Report.verify);

  app.get('/item/verifier/:id', ReportItem.get_by_verifier);
  app.get('/item/reporter/:id', ReportItem.get_by_reporter);
  app.post('/verify/item/:id/by/:verifier_id', ReportItem.verify);

  app.get('/points/:id', Common.calculatePoint);


  //app.get('/history/:id', request.get_history);

  //app.get('/score/:id', request.get_score);

  //app.post('/add-activity', activity.add_or_update);
};
