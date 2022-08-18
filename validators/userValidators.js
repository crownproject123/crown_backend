"use strict";
const Joi = require("joi");

const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

module.exports = {
  createNewUser: (data) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      locationId: Joi.string().allow(""),
      role: Joi.string().valid("manager", "guard", "customer"),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      doj: Joi.string().allow(""),
      dob: Joi.string().allow(""),
      designation: Joi.string().allow(""),
      gender: Joi.string().allow(""),
      fatherOrHusbandName: Joi.string().allow(""),
      motherOrOtherFamilyMemberName: Joi.string().allow(""),
      address: Joi.string().allow(""),
      contactNo: Joi.string().allow(""),
      alternateNo: Joi.string().allow(""),
      nameAsOnAadhar: Joi.string().allow(""),
      pan: Joi.string().allow(""),
      pcc: Joi.boolean().allow(""),
      idStatus: Joi.boolean().allow(""),
      bankAccountNo: Joi.string().allow(""),
      bankIFSC: Joi.string().allow(""),
    });

    return schema.validate(data ? data : {}, options);
  },

  getAllUser: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
      role: Joi.string().allow(""),
    });

    return schema.validate(data ? data : {}, options);
  },

  updateUser: (data) => {
    const schema = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      locationId: Joi.string(),
      disabled: Joi.boolean(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
