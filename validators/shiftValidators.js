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
  createNewShift: (data) => {
    const schema = Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required(),
      locationId: Joi.string().required(),
      name: Joi.string(),
    });

    return schema.validate(data ? data : {}, options);
  },

  getAllShift: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
      locationId: Joi.string().allow(""),
      start: Joi.string().allow(""),
      end: Joi.string().allow(""),
    });

    return schema.validate(data ? data : {}, options);
  },

  updateShift: (data) => {
    const schema = Joi.object({
      start: Joi.string(),
      end: Joi.string(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
