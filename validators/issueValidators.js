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
  createNewIssue: (data) => {
    const schema = Joi.object({
      issue: Joi.string().required(),
      locationId: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },

  getAllIssue: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
      locationId: Joi.string().allow(""),
    });

    return schema.validate(data ? data : {}, options);
  },

  updateIssue: (data) => {
    const schema = Joi.object({
      issue: Joi.string(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
