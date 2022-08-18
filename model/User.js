"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "guard", "customer"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reset_password_token: {
    type: String,
  },
  reset_password_token_used: {
    type: Boolean,
  },
  profile_picture: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accessories: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  fcmToken: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },

  doj: {
    type: Date,
  },
  dob: {
    type: Date,
  },
  designation: {
    type: String,
  },
  gender: {
    type: String,
  },
  fatherOrHusbandName: {
    type: String,
  },
  motherOrOtherFamilyMemberName: {
    type: String,
  },
  address: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  alternateNo: {
    type: String,
  },
  nameAsOnAadhar: {
    type: String,
  },
  pan: {
    type: String,
  },
  pcc: {
    type: Boolean,
  },
  idStatus: {
    type: Boolean,
  },
  bankAccountNo: {
    type: String,
  },
  bankIFSC: {
    type: String,
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

UserSchema.pre("save", function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = new mongoose.model("User", UserSchema);
