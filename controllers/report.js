"use strict";

var debug = require('debug')('report_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;

function* map(it, f) {
  let result = [];
  for (let x of it) {
    let res = yield f(x);
    result.push(res);
  }
  return result;
}

module.exports = {
  create: function *(next) {
    let data = this.request.body;
    debug(data);

    let report = yield Report.create(data);

    let verifiers = yield map(data.verifiers, function*(verifier) {
      let res = yield ReportVerifier.findOrCreate({where: {xo_uuid: verifier.xo_uuid}});
      return res[0];
    });

    debug(verifiers);
    yield report.setVerifiers(verifiers);

    let items = yield map(data.report_items, function*(data) {
      data.total_point = (data.point || 5) * (data.count || 1);
      return yield ReportItem.create(data);
    });

    debug(items);
    yield report.setItems(items);

    this.body = report;

    yield next;
  },

  get_by_verifier: function *(next) {
    debug("verifier id : " + this.params.id);

    let verifier = yield ReportVerifier.findOne({
      where: {
        xo_uuid: this.params.id
      }
    });

    if (!verifier) {
      this.throw(404, "There is no verifier given id.");
    }

    let reports = yield verifier.getReports({
      where: {
        verified: false
      }
    });
    debug(reports); 

    if (reports.length == 0) {
      this.throw(404, "There is no unverified report for this verifier.");
    }

    this.body = reports;

    yield next;
  },

  get_by_reporter: function *(next) {
    debug("reporter id : " + this.params.id);

    let report = yield Report.findAll({
      include: [{ all: true}],
      where: {
        reporter_xo_uuid: this.params.id
      }
    });

    if (!report) {
      this.throw(404, "There is no record by given reporter.");
    }

    debug(report);

    this.body = report;

    yield next;
  },

  verify: function *(next) {
    let params = this.params;
    debug("report id : " + params.id);
    debug("verifier id : " + params.verifier_id);

    let report = yield Report.findOne({
      where: {
        id: params.id
      }
    });

    debug(report);

    if (!report) {
      this.throw(404, "There is no report given id.");
    }

    if (report.get('verified')) {
      this.throw(409, "Already verified by someone.");
    }

    let verifier = yield report.getVerifiers({
      where: {
        xo_uuid: params.verifier_id
      }
    });

    debug(verifier);

    if (!verifier || verifier.length == 0) {
      this.throw(404, "Verifier id is not matching.");
    }

    let updatedReport = yield report.updateAttributes({
      verified: true,
      verified_at: Date.now(),
      verified_by: verifier[0].get('xo_uuid')
    });

    debug(updatedReport);
    this.body = updatedReport;

    yield next;
  }
}