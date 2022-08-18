"use strict";

const FormResponse = require("../model/FormResponse");
const formResponseValidators = require("../validators/formResponseValidators");
const User = require("../model/User");

module.exports = {
  createNewFormResponse: async (req, res) => {
    try {
      // Validate request data
      let validatedData = formResponseValidators.createNewFormResponse(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { response } = validatedData.value;

      // Create new FormResponse
      let newFormResponse = FormResponse();
      newFormResponse.response = JSON.parse(response);
      await newFormResponse.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Form Response"), newFormResponse);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  sendFormLink: async (req, res) => {
    try {
      // Validate request data
      let validatedData = formResponseValidators.sendFormLink(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { phoneNumber } = validatedData.value;

      // Send form link
      // TODO: send form link via SMS

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Form link sent successfully"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllFormResponse: async (req, res) => {
    try {
      // Validate request data
      let validatedData = formResponseValidators.getAllFormResponse(req.query);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { search, filter, orderBy } = validatedData.value;

      // Apply filter
      let filterQuery = {};
      let today = new Date();
      if (filter === "1 Day") {
        const targetDate = new Date(new Date().setDate(new Date().getDate() - 1));
        filterQuery = { createdAt: { $gte: targetDate, $lte: today } };
      }
      if (filter === "7 Days") {
        const targetDate = new Date(new Date().setDate(new Date().getDate() - 7));
        filterQuery = { createdAt: { $gte: targetDate, $lte: today } };
      }
      if (filter === "1 Month") {
        const targetDate = new Date(new Date().setDate(new Date().getDate() - 30));
        filterQuery = { createdAt: { $gte: targetDate, $lte: today } };
      }

      // Apply Search
      let searchQuery = {};
      if (search && search !== "") {
        const targetUsers = await User.find({ email: search });
        searchQuery = { user: { $in: targetUsers } };
      }

      // Apply Order by
      const orderByQuery = {};
      if (orderBy && orderBy !== "") {
        const orderByArr = orderBy.split(":");
        const key = orderByArr[0];
        const value = orderByArr[1];
        orderByQuery[key] = value;
      }

      // Get all FormResponses
      const allFormResponses = await FormResponse.find({ ...filterQuery, ...searchQuery }).sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Form Response"), allFormResponses);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleFormResponse: async (req, res) => {
    try {
      const formResponseId = req.params.formResponseId;
      const formResponseData = await FormResponse.findById(formResponseId);
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Form Response"), formResponseData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateFormResponse: async (req, res) => {
    try {
      // Validate request data
      let validatedData = formResponseValidators.updateFormResponse(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { response } = validatedData.value;

      const formResponseId = req.params.formResponseId;
      const formResponseData = await FormResponse.findById(formResponseId);
      formResponseData.response = JSON.parse(response);
      await formResponseData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Form Response"), formResponseData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteFormResponse: async (req, res) => {
    try {
      const formResponseId = req.params.formResponseId;
      await FormResponse.findOneAndDelete({ _id: formResponseId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Form Response"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
