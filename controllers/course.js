"use strict";

var debug = require('debug')('course_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;
var Reporter = Models.Reporter;
let Course = Models.Course;

let child_process = require('child_process');
let refresh;

module.exports = {
  get: function*(next) {
    this.body = yield Course.findAll();

    yield next;
  },

  refresh: function*(next) {
  	
  	try {
  		child_process.execSync('pm2 start crawler.js --cron="0 0 * * 1-5" --node-args="--harmony"');
  		this.status = 200;
  	} catch(e) {
  		this.status = 500;
  		this.body = 'Refresh is in progress. Retry later.';
  	}
  	
 	yield next;
  }
}