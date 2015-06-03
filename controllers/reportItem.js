"use strict";

var debug = require('debug')('reportItem_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;

module.exports = {
	get_by_verifier: function*(next) {
		debug("verifier id : " + this.params.id);

		let items = yield ReportItem.findAll({
			where: {
				verified: false
			},
			include: [{
				model: Report,
				attributes: ['name'],
				include: [{
					model: ReportVerifier,
					//attributes: [],
					where: {
						xo_uuid: this.params.id
					}
				}]
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
		let params = this.params;
		debug("item id : " + params.id);
		debug("verifier id : " + params.verifier_id);

		let item = yield ReportItem.findOne({
			where: {
				id: params.id,
				verified: false
			},
			include: [{
				model: Report,
				include: [{
					model: ReportVerifier,
					where: {
						xo_uuid: params.verifier_id
					}
				}]
			}]
		});

		debug(item);
		if (!item) {
			this.throw(404, "There is no matching unverified report item.")
		}

		yield item.update({
			verified: true,
			verified_at: Date.now()
		});
		
		yield item.setVerifier(item.get('Report').get('Verifiers')[0]);
		
		debug(yield item.getVerifier());

		this.body = item;

		yield next;
	},
	get_by_reporter: function*(next) {
		debug("reporter id : " + this.params.id);	

		let items = yield ReportItem.findAll({
		  	include: [{
		  		attributes: [],
		  		model: Report,
		  		where: {
		   	 		reporter_xo_uuid: this.params.id
		  		}
		  	}]
		});

		debug(items);

		if (items.length == 0) {
		  	this.throw(404, "There is no record by given reporter.");
		}
		
		this.body = items;

		yield next;
	}
}