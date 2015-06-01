'use strict';

var path = require('path');

function load(name) {
  return require(path.join(__dirname, name));
}

module.exports = {

  Report: load('report'),
  ReportItem: load('reportItem'),
  Common: load('common')
};