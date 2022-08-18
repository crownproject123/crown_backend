"use strict";

const Shift = require("../model/Shift");
const shiftValidators = require("../validators/shiftValidators");
const User = require("../model/User");
const Location = require("../model/Location");

module.exports = {
  createNewShift: async (req, res) => {
    try {
      // Validate request data
      let validatedData = shiftValidators.createNewShift(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { locationId, start, end, name } = validatedData.value;

      // Create new Shift
      let newShift = Shift();
      newShift.user = req.user;
      newShift.start = start;
      newShift.end = end;
      newShift.name = name;
      newShift.location = await Location.findById(locationId);
      await newShift.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Shift"), newShift);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllShift: async (req, res) => {
    try {
      // Validate request data
      let validatedData = shiftValidators.getAllShift(req.query);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { search, filter, orderBy, locationId, start, end } = validatedData.value;

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
      if (start && start !== "" && end && end !== "") {
        filterQuery["start"] = { $gte: start, $lte: end };
        filterQuery["end"] = { $gte: start, $lte: end };
      } else {
        if (start && start !== "") {
          filterQuery["start"] = { $gte: start };
          filterQuery["end"] = { $gte: start };
        }
        if (end && end !== "") {
          filterQuery["start"] = { $lte: end };
          filterQuery["end"] = { $lte: end };
        }
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

      // Get all Shifts
      let findQuery = { ...filterQuery, ...searchQuery };
      if (locationId && locationId !== "") {
        findQuery = { ...filterQuery, ...searchQuery, location: locationId };
      }
      const allShifts = await Shift.find(findQuery).populate("user location").sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Shift"), allShifts);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleShift: async (req, res) => {
    try {
      const shiftId = req.params.shiftId;
      const shiftData = await Shift.findById(shiftId).populate("user location");
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Shift"), shiftData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateShift: async (req, res) => {
    try {
      // Validate request data
      let validatedData = shiftValidators.updateShift(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { start, end } = validatedData.value;

      const shiftId = req.params.shiftId;
      const shiftData = await Shift.findById(shiftId).populate("user location");
      shiftData.start = start;
      shiftData.end = end;
      await shiftData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Shift"), shiftData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteShift: async (req, res) => {
    try {
      const shiftId = req.params.shiftId;
      await Shift.findOneAndDelete({ _id: shiftId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Shift"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
