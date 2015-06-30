'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('items', 'VerifierXoUuid');
    queryInterface.addColumn('items', 'VerifiedByXoUuid', {
      type: DataTypes.STRING,
      references: "verifiers",
      referencesKey: "xo_uuid"
    });
  },
  
  down: function (queryInterface, DataTypes) {
    queryInterface.removeColumn('reports', 'VerifiedByXoUuid');
    queryInterface.addColumn('items', 'VerifierXoUuid', {
      type: DataTypes.STRING,
      references: "verifiers",
      referencesKey: "xo_uuid"
    });
  }
};