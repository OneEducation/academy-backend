"use strict";

let debug = require('debug')('infinity_controller');

module.exports = {
  celery: function*(next) {
  	let data = this.request.body;

    debug(data);

    this.status = 200;
 	  yield next;
  }
}