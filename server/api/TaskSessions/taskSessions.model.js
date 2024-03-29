"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let TaskSessionsSchema = new Schema({
  checkin: Date,
  checkout: Date,
  task: String,
  project: String,
  timezone: String,
  timed: { type: Boolean, default: false },
  user: { email: String, id: String, name: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TaskSessionsSchema.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
TaskSessionsSchema.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let model = mongoose.model("TaskSession", TaskSessionsSchema);

module.exports = model;
