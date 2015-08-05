'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.addColumn('courses', 'state', {
      type: DataTypes.STRING
    });
  },
  
  down: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('courses', 'state');
  }
};