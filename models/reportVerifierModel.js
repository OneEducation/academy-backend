'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Verifier', {
    xo_uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }, 
    gcm_token: {
      type: DataTypes.STRING
    },
    activity_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'verifiers',
    timestamps: false,
    // indexes: [{
    //   name: 'index_by_studentID',
    //   method: 'BTREE',
    //   fields: ['student_id']
    // }]
  });
};