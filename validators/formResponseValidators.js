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
  createNewFormResponse: (data) => {
    const schema = Joi.object({
      response: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  sendFormLink: (data) => {
    const schema = Joi.object({
      phoneNumber: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  getAllFormResponse: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
    });

    return schema.validate(data ? data : {}, options);
  },

  updateFormResponse: (data) => {
    const schema = Joi.object({
      response: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
