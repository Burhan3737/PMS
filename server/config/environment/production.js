"use strict";

// Production specific configuration
// ==================================

module.exports = {
  // MongoDB connection options
  mongo: {
    // uri: 'mongodb://localhost/iot-dev'
    // uri: 'mongodb://sa:welcome@ds021289.mlab.com:21289/railgroup-dev'
    uri: "mongodb://127.0.0.1:27017/test",
  },
  seedDB: false,
  defaultData: {
    tenant: {
      id: "tenant",
      desc: "tenant",
      name: "Tenant",
    },
    email: "admin@timps.com",
    pass: "admin",
    adminGroup: { id: "admin", desc: "Administrator" },
  },
  createNewDatabase: false,
  newDatabaseAppName: "",
  applicationType: "TIMPS",
  updateDatabaseForApplicationType: false, // applicationType is only effective with this being true
  updateOldDatabase: false, //
  updateConfigurations: false,
  updateApplicationLookups: false,
  addConfigurations: false,
  addIOCaplphanumericMarkersList: false,
};
