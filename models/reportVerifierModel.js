'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Verifier', {
    xo_uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
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