"use strict";

let debug = require('debug')('reportItem_controller');
let Models = require('../models');
let Report = Models.Report;
let ReportItem = Models.Item;
let ReportVerifier = Models.Verifier;
let Reporter = Models.Reporter;
let Course = Models.Course;

module.exports = {
  get_by_verifiedBy: function *(next) {
    debug("verifier id : " + this.params.id);

    let items = yield ReportItem.findAll({
      // where: {
      //  verified: false
      // },
      include: [{
        model: Report,
        include: [{
          model: Reporter,
          attributes: ['name']
        }]
      }, {
        model: ReportVerifier,
        as: 'VerifiedBy',
        where: {
          xo_uuid: this.params.id
        }
      }, {
        model: Course,
        attributes: ['title', 'point', 'action']
      }]
    });
    debug(items);

    if (items.length == 0) {
      this.throw(404, "There is no unverified report items for this verifier.");
    }

    this.body = items;

    yield next;
  },
  get_by_verifier: function*(next) {
    debug("verifier id : " + this.params.id);

    let items = yield ReportItem.findAll({
      // where: {
      //  verified: false
      // },
      include: [{
        model: Report,
        include: [{
          model: Reporter,
          attributes: ['name']
        }]
      }, {
        model: ReportVerifier,
        where: {
          xo_uuid: this.params.id
        }
      }, {
        model: Course,
        attributes: ['title', 'point', 'action']
      }]
    });
    debug(items);

    if (items.length == 0) {
      this.throw(404, "There is no unverified report items for this verifier.");
    }

    this.body = items;

    yield next;
  },
  verify: function*(next) {
    let params = this.request.body;
    debug("item id : " + params.id);
    debug("verifier id : " + params.verifier_id);

    let item = yield ReportItem.findOne({
      where: {
        id: params.id,
        //verified: false
      },
      include: [{
        model: ReportVerifier,
        where: {
          xo_uuid: params.verifier_id
        }
      }, {
        model: Course,
        attributes: ['title', 'point', 'action']
      }]
    });

    debug(item);

    if (!item) {
      this.throw(404, "There is no report to you.");
    }

    let verifier = (yield item.getVerifiers())[0];
    let course = yield item.getCourse();

    // Give point to verifier
    yield verifier.increment('activity_count');
    yield verifier.reload();

    // Update only unverified one
    if (item.get('verified') === false) { 
      yield item.update({
        count: params.count,
        verified: true,
        verified_at: Models.sequelize.fn('NOW'),
        total_point: params.count * course.get('point'),
        VerifiedByXoUuid: verifier.get('xo_uuid')
      });
    }
    
    // Remove verifier from item
    yield item.removeVerifier(verifier);
    
    this.body = {
      points: verifier.get('activity_count')
    };

    yield next;
  },
  get_by_reporter: function*(next) {
    debug("reporter id : " + this.params.id); 

    let items = yield ReportItem.findAll({
      include: [{
        model: Report,
        attributes: ['ReporterXoUuid'],
        include: [{
          model: Reporter,
          where: {
            xo_uuid: this.params.id
          }
        }]
      }, {
        model: Course,
        attributes: ['title', 'point', 'action']
      }]
    });

    debug(items);

    if (items.length == 0) {
        this.throw(404, "There is no record by given reporter.");
    }
    
    this.body = items;

    yield next;
  },
  ignore: function*(next) {
    let params = this.params;
    debug("item id : " + params.id);
    debug("verifier id : " + params.verifier_id);

    let item = yield ReportItem.findOne({
      where: {
        id: params.id,
        //verified: false
      },
      include: [{
        model: ReportVerifier,
        where: {
          xo_uuid: params.verifier_id
        }
      }]
    });

    if (!item) {
      this.throw(404, "There is no matching report to ignore.")
    }
    
    let verifier = (yield item.getVerifiers())[0];
    yield verifier.increment('activity_count');
    yield verifier.reload();
    yield item.removeVerifier(verifier);
    
    this.body = {
      points: verifier.get('activity_count')
    };
    
    yield next;
  }
}