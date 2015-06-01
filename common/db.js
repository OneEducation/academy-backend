var Sequelize = require('sequelize');
var database = require('../config').database;

var sequelize = new Sequelize(database.db, database.username, database.password, database);

module.exports = sequelize;