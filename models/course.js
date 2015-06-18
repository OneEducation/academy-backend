'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Course', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT
    },
    content_url: {
      type: DataTypes.STRING
    },
    thumbnail_url: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    original_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'courses'
  });
};