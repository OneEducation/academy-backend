'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.addColumn('courses', 'teacher_only', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },
  
  down: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('courses', 'teacher_only');
  }
};