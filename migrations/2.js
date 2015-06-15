'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
  	queryInterface.createTable('reporters', {
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
	    timestamps: false
  	});

    queryInterface.addColumn('reports', 'ReporterXoUuid', {
      type: DataTypes.STRING,
      references: "reporters",
      referencesKey: "xo_uuid"
    });

    queryInterface.removeColumn('reports', 'reporter_xo_uuid');
    queryInterface.removeColumn('reports', 'name');
  },
  
  down: function (queryInterface, DataTypes) {
  	queryInterface.dropTable('reporters');
    queryInterface.removeColumn('reports', 'ReporterXoUuid');
    queryInterface.addColumn('reports', 'reporter_xo_uuid', {
	  type: DataTypes.STRING,
      allowNull: false
    });
    queryInterface.addColumn('reports', 'name', {
	  type: DataTypes.STRING,
      allowNull: false
    });
  }
};