"use strict";

var debug = require('debug')('course_controller');
var Models = require('../models');
let Course = Models.Course;

let child_process = require('child_process');

module.exports = {
  get: function*(next) {
    this.body = yield Course.findAll({
      where: {
        category: {
          $ne: null
        }
      }
    });

    yield next;
  },

  refresh: function*(next) {
  	
  	try {
  		child_process.execSync('pm2 start crawler.js -i 1 --cron="0 0 * * 1-5" --node-args="--harmony"');
  		this.status = 200;
  	} catch(e) {
  		this.status = 500;
  		this.body = 'Refresh is in progress. Retry later.';
  	}
  	
 	  yield next;
  }
}