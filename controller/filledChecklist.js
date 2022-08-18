"use strict";

const FilledChecklist = require("../model/FilledChecklist");
const filledChecklistValidators = require("../validators/filledChecklistValidators");
const User = require("../model/User");
const Location = require("../model/Location");
const QRCode = require("qrcode");
var fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  createNewFilledChecklist: async (req, res) => {
    try {
      // Validate request data
      let validatedData = filledChecklistValidators.createNewFilledChecklist(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { locationId, values } = validatedData.value;

      // Create filledChecklist
      const filledChecklistData = FilledChecklist();
      filledChecklistData.location = await Location.findById(locationId);
      filledChecklistData.user = req.user;
      filledChecklistData.value = JSON.parse(values);
      await filledChecklistData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Filled Checklist"), filledChecklistData);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllFilledChecklist: async (req, res) => {
    try {
      // Validate request data
      let validatedData = filledChecklistValidators.getAllFilledChecklist(req.query);
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
        if (ObjectId.isValid(search)) {
          searchQuery = { location: search };
        }
      }

      // Apply Order by
      const orderByQuery = {};
      if (orderBy && orderBy !== "") {
        const orderByArr = orderBy.split(":");
        const key = orderByArr[0];
        const value = orderByArr[1];
        orderByQuery[key] = value;
      }

      // Get all FilledChecklists
      const allFilledChecklists = await FilledChecklist.find({ ...filterQuery, ...searchQuery }).sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Filled Checklist"), allFilledChecklists);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleFilledChecklist: async (req, res) => {
    try {
      const filledChecklistId = req.params.filledChecklistId;
      const filledChecklistData = await FilledChecklist.findById(filledChecklistId);
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Filled Checklist"), filledChecklistData);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteFilledChecklist: async (req, res) => {
    try {
      const filledChecklistId = req.params.filledChecklistId;
      await FilledChecklist.findOneAndDelete({ _id: filledChecklistId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Filled Checklist"));
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
