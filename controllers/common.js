"use strict";

let JsonDB = require('node-json-db');
var debug = require('debug')('common_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;
var Reporter = Models.Reporter;
  
//The second argument is used to tell the DB to save after each push
//If you put false, you'll have to call the save() method.
//The third argument is to ask JsonDB to save the database in an human readable format. (default false)
let metadataDB = new JsonDB("meta_data", true, true);

module.exports = {
  verifierPoint: function*(next) {
    debug('xo_uuid: ' + this.params.id);
    let verifier = yield ReportVerifier.findOne({
      where: {
        xo_uuid: this.params.id
      }
    });

    if (!verifier) {
      this.throw(404, "There is no verifier with that id.");
    }

    this.body = {
      points: verifier.get('activity_count')
    };

    yield next;
  },
  
  reporterPoint: function*(next) {
    debug('xo_uuid: ' + this.params.id);

    let sum = yield ReportItem.findOne({
      attributes: [
          [Models.sequelize.fn('SUM', Models.sequelize.col('total_point')), 'points']
      ],
      where: {
        verified: true
      },
      include: [{
        model: Report,
        include: [{
          model: Reporter,
          where: {
            xo_uuid: this.params.id
          }
        }]
      }]
    });

    debug(sum);
    this.body = {
      points: sum.get('points') || 0
    };

    yield next;
  },

  register: function*(next) {
    let xo_uuid = this.request.body.xo_uuid;
    let gcm_token = this.request.body.gcm_token;

    debug(xo_uuid + ' / ' + gcm_token);

    let verifier = (yield ReportVerifier.findOrCreate({
      where: {
        xo_uuid: xo_uuid
      }
    }))[0];

    if (!verifier) {
      this.throw(403);
    }

    verifier = yield verifier.update({
      gcm_token: gcm_token
    });

    debug(verifier);
    this.body = verifier;

    yield next;
  },

  getAppIntent: function*(next) {
    let data = metadataDB.getData("/app_intent");
    debug(data);

    this.body = data;
    yield next;
  },

  setAppIntent: function*(next) {
    let data = this.request.body;
    debug(data);
    metadataDB.push("/app_intent", data);

    this.status = 200;
    yield next;
  }
}