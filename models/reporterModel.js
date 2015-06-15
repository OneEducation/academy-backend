'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Reporter', {
    xo_uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gcm_token: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'reporters',
    timestamps: false,
  });
};