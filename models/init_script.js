'use strict';

/**
 * Module dependencies.
 */

// var config = require('../config');

// config.database.logging = console.log;

// // $ node --harmony models/init_script.js <force> <dialect> <port> <username>
// var force = process.argv[2] === 'true';
// var dialect = process.argv[3];
// if (dialect) {
//   config.database.dialect = dialect;
// }
// var port = process.argv[4];
// if (port) {
//   config.database.port = parseInt(port);
// }
// var username = process.argv[5];
// if (username) {
//   config.database.username = username;
// }

var models = require('./');

models.setAssociations();
models.sequelize.sync({ force: true })
  .then(function () {

      // if (err) {
      //   console.error('[models/init_script.js] sequelize init fail');
      //   console.error(err);
      //   throw err;
      // } else {
        console.log('[models/init_script.js] sequelize sync and init success');
        process.exit(0);
      // }

  })
  .catch(function (err) {
    console.error('[models/init_script.js] sequelize sync fail');
    console.error(err);
    process.exit(1);
  });