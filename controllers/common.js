"use strict";

var debug = require('debug')('common_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;

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
				where: {
					reporter_xo_uuid: this.params.id
				},
				attributes: []
			}]
		});

		debug(sum);
		this.body = sum;

		yield next;
	}
}