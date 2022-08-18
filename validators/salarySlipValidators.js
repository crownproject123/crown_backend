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
  createNewSalarySlip: (data) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
      organizationName: Joi.string().required(),
      period: Joi.string().required(),
      issuedAt: Joi.string().required(),
      bankName: Joi.string().required(),
      bankAccountNo: Joi.string().required(),
      location: Joi.string().required(),
      workingDays: Joi.string().required(),
      department: Joi.string().required(),
      designation: Joi.string().required(),

      earning_basicSalary: Joi.string().required(),
      earning_houseRentAllowance: Joi.string().required(),
      gross_earnings: Joi.string().required(),

      deduction_pf: Joi.string().required(),
      deduction_tax: Joi.string().required(),
      gross_deductions: Joi.string().required(),

      net_pay: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },

  getAllSalarySlip: (data) => {
    const schema = Joi.object({
      search: Joi.string().allow(""),
      orderBy: Joi.string().valid("createdAt:asc", "createdAt:desc").allow(""),
      filter: Joi.string().valid("All Time", "1 Day", "7 Days", "1 Month"),
    });

    return schema.validate(data ? data : {}, options);
  },

  updateSalarySlip: (data) => {
    const schema = Joi.object({
      organizationName: Joi.string().required(),
      amount: Joi.number().required(),
      date: Joi.string().required(),
    });

    return schema.validate(data ? data : {}, options);
  },
};
