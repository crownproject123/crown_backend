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
  updateAccessory: (data) => {
    const schema = Joi.object({
      accessories: Joi.string(),
      userId: Joi.string(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
