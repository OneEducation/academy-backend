'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'teacher',
    timestamps: false,
  });
};

// title = pw.CharField(null=True)
// first_name = pw.CharField(null=True)
// last_name = pw.CharField(null=True)
// email = pw.CharField(null=False)
// password = pw.CharField(null=False)
// avatar = pw.CharField(null=True)
// avatar_large = pw.CharField(null=True)
// ext_teacher_id = pw.CharField(null=True)
// ext_school_id = pw.CharField(null=True)
// xo_serial = pw.CharField(null=True)
// is_verified = pw.BooleanField(default=False)
// session_token = pw.CharField(null=True)
// is_admin = pw.BooleanField(default=False)