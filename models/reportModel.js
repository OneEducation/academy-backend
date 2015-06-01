'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Report', {
    reporter_xo_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'reports',
    timestamps: false,
  });
};