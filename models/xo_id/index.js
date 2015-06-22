'use strict';

var path = require('path');
var Sequelize = require('sequelize');
var sequelize = require('../../common/db').xo_id;

function load(name) {
  console.log(path.join(__dirname, name));
  return sequelize.import(path.join(__dirname, name));
}

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,

  Teacher: load('teacher'),

  setAssociations: function () {

  },

  init: function(callback) {
    this.setAssociations();
    this.sequelize.sync().then(callback);
  },

  query: function* (sql, args) {
    var options = { replacements: args };
    var data = yield this.sequelize.query(sql, options).spread();
    if (/select /i.test(sql)) {
      return data[0];
    }
    return data[1];
  },
  queryOne: function* (sql, args) {
    var rows = yield* this.query(sql, args);
    return rows && rows[0];
  }
};