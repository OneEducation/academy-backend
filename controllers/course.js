"use strict";

var debug = require('debug')('course_controller');
var Models = require('../models');
let Course = Models.Course;

let child_process = require('child_process');

module.exports = {
  get: function*(next) {
    if (this.params.state) {
      this.body = yield Course.findAll({
        where: {
          $or: [{
            state: null
          }, {
            state: this.params.state
          }]
        }
      });
    } else {
      this.body = yield Course.findAll();
    }

    yield next;
  },

  refresh: function*(next) {
  	
  	try {
  		child_process.execSync("pm2 start crawler.js -i 1 -c '0 0 * * 1-5' --node-args '--harmony'");
  		this.status = 200;
  	} catch(e) {
  		this.status = 500;
  		this.body = 'Refresh is in progress. Retry later.';
  	}
  	
 	  yield next;
  }
}