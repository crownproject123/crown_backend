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
  login: (data) => {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  createAdmin: (data) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  sendForgotPasswordLink: (data) => {
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
    });

    return schema.validate(data ? data : {}, options);
  },
  setNewPassword: (data) => {
    const schema = Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
