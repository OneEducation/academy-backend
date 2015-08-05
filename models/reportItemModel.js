'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Item', {
    course_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    total_point: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verified_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'items',
    timestamps: false,
  });
};