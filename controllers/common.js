"use strict";

var debug = require('debug')('common_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;
var Reporter = Models.Reporter;

module.exports = {
	calculatePoint: function*(next) {
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

		let verifier = yield ReportVerifier.findOne({
			where: {
				xo_uuid: xo_uuid
			}
		});

		if (!verifier) {
			this.throw(403);
		}

		verifier = yield verifier.update({
			gcm_token: gcm_token
		});

		debug(verifier);
		this.body = verifier;

		yield next;
	}
}