'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.addColumn('courses', 'action', {
      type: DataTypes.STRING
    });
  },
  
  down: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('courses', 'action');
  }
};