"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let TeamSchema = new Schema({
  teamName: String,
  project: String,
  teamManager: { email: String, id: String, name: String },
  teamLead: { email: String, id: String, name: String },
  team: [{ email: String, id: String, name: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TeamSchema.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
TeamSchema.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let model = mongoose.model("Team", TeamSchema);

module.exports = model;
