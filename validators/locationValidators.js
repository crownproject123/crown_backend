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
  getAllLocation: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
    });

    return schema.validate(data ? data : {}, options);
  },
  createNewLocation: (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      lat: Joi.string().required(),
      long: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  updateLocation: (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      checklist: Joi.string(),
      lat: Joi.string(),
      long: Joi.string(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
