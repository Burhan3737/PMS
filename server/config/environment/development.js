"use strict";

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options

  mongo: {
    //uri: "mongodb://iahmed:27017/pms",
    uri: "mongodb://localhost:27017/pms",
  },

  seedDB: true,
  defaultData: {
    tenant: {
      id: "tenant",
      desc: "tenant",
      name: "Tenant",
    },
    email: "admin@pms.com",
    pass: "admin",
    adminGroup: { id: "admin", desc: "Administrator" },
  },
};
