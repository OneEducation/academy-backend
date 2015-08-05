'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('items', 'title');
    queryInterface.removeColumn('items', 'point');
    // queryInterface.addColumn('items', 'verified_count', {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0
    // });
    // queryInterface.addColumn('items', 'verified_point', {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0
    // });
  },
  
  down: function (queryInterface, DataTypes) {
  	queryInterface.addColumn('items', 'title', {
      type: DataTypes.STRING,
      allowNull: false
    });
    queryInterface.addColumn('items', 'point', {
      type: DataTypes.INTEGER,
      defaultValue: 5
    });
    // queryInterface.removeColumn('items', 'verified_count');
    // queryInterface.removeColumn('items', 'verified_point');
  }
};