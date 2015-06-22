'use strict';

let Sequelize = require('sequelize');
let database = require('../config').database;
let xoid_db = require('../config').xoid_db;

module.exports = {
	academy: new Sequelize(database.db, database.username, database.password, database),
	xo_id: new Sequelize(xoid_db.db, xoid_db.username, xoid_db.password, xoid_db)
}