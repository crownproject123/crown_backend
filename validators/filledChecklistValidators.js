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
  getAllFilledChecklist: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
    });

    return schema.validate(data ? data : {}, options);
  },
  createNewFilledChecklist: (data) => {
    const schema = Joi.object({
      locationId: Joi.string().required(),
      values: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
