"use strict";

const mongoose = require("mongoose");

const FormResponseSchema = new mongoose.Schema({
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FormResponseSchema.pre("save", function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = new mongoose.model("FormResponse", FormResponseSchema);
