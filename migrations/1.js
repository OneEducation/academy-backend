'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('verifiers', 'gcm_token', Sequelize.STRING);
  },
  
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('verifiers', 'gcm_token');
  }
};
