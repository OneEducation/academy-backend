'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.addColumn('verifiers', 'activity_count', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    });
  },
  
  down: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('verifiers', 'activity_count');
  }
};