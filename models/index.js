'use strict';

var path = require('path');
var Sequelize = require('sequelize');
var sequelize = require('../common/db').academy;

function load(name) {
  console.log(path.join(__dirname, name));
  return sequelize.import(path.join(__dirname, name));
}

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,

  Report: load('reportModel'),
  Reporter: load('reporterModel'),
  Item: load('reportItemModel'),
  Verifier: load('reportVerifierModel'),

  Course: load('course'),

  setAssociations: function () {
    this.Report.hasMany(this.Item);
    this.Item.belongsTo(this.Report);

    this.Item.belongsTo(this.Verifier, {
      constraints: false,
      as: 'VerifiedBy'
    });

    this.Item.belongsToMany(this.Verifier, {
      through: 'items_verifiers'});

    this.Verifier.belongsToMany(this.Item, {
      through: 'items_verifiers'});

    this.Report.belongsTo(this.Reporter);
    
    this.Item.belongsTo(this.Course, {
      foreignKey: 'course_id'
    });
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