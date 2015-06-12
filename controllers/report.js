"use strict";

let request = require('co-request');
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
      return yield ReportItem.create(data);
    });

    debug(items);
    yield report.setItems(items);

    this.body = report;

    let options = {
      uri: 'https://gcm-http.googleapis.com/gcm/send',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'key= AIzaSyBwfQhNExkKKIxgVhZAWLu2mJ_d1zdj1gg'
      },
      body: {
        data: {
            "title": "Verification request",
            "text": report.name + ' requested ' + items.length + ' items.'
        },
        registration_ids: verifiers.map(function(verifier) {
          return verifier.gcm_token;
        })        
      }
    };

    console.log(options);

    let result = yield request(options);

    console.log(result);

    yield next;
  }
}