'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Report', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'reports',
    timestamps: false,
  });
};