"use strict";

const Location = require("../model/Location");
const locationValidators = require("../validators/locationValidators");
const User = require("../model/User");
const QRCode = require("qrcode");
var fs = require("fs");

module.exports = {
  createNewLocation: async (req, res) => {
    try {
      // Validate request data
      let validatedData = locationValidators.createNewLocation(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { name, lat, long } = validatedData.value;

      // Check location already exist
      if ((await Location.countDocuments({ name })) != 0) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("This location already exist"));
      }

      // Create location
      const locationData = Location();
      locationData.name = name;
      locationData.lat = lat;
      locationData.long = long;
      await locationData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Location"), locationData);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllLocation: async (req, res) => {
    try {
      // Validate request data
      let validatedData = locationValidators.getAllLocation(req.query);
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
        searchQuery = { name: { $regex: search } };
      }

      // Apply Order by
      const orderByQuery = {};
      if (orderBy && orderBy !== "") {
        const orderByArr = orderBy.split(":");
        const key = orderByArr[0];
        const value = orderByArr[1];
        orderByQuery[key] = value;
      }

      // Get all Locations
      const allLocations = await Location.find({ ...filterQuery, ...searchQuery })
        .sort(orderByQuery)
        .lean();

      await Promise.all(
        allLocations.map(async (loc) => {
          loc.access = await User.find({ location: loc, role: "customer" }).lean();
          loc.guards = await User.find({ location: loc, role: "guard" }).lean();
        })
      );

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Location"), allLocations);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleLocation: async (req, res) => {
    try {
      const locationId = req.params.locationId;
      const locationData = await Location.findById(locationId).lean();
      locationData.access = await User.find({ location: locationData, role: "customer" }).lean();
      locationData.guards = await User.find({ location: locationData, role: "guard" }).lean();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Location"), locationData);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateLocation: async (req, res) => {
    try {
      // Validate request data
      let validatedData = locationValidators.updateLocation(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { name, checklist, lat, long, access } = validatedData.value;

      // Update location
      const locationId = req.params.locationId;
      const locationData = await Location.findById(locationId);

      if (name && name !== "") {
        locationData.name = name;
      }

      if (checklist && checklist !== "") {
        locationData.checklist = JSON.parse(checklist);
      }

      if (lat && lat !== "") {
        locationData.lat = lat;
      }

      if (long && long !== "") {
        locationData.long = long;
      }

      await locationData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Location"), locationData);
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteLocation: async (req, res) => {
    try {
      const locationId = req.params.locationId;
      await Location.findOneAndDelete({ _id: locationId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Location"));
    } catch (e) {
      console.log(e);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getLocationQR: async (req, res) => {
    try {
      const { format } = req.body;
      const locationId = req.params.locationId;
      const locationData = await Location.findById(locationId);

      const qrData = await QRCode.toString(locationData._id.toString(), { type: format });

      return res.send(qrData);
    } catch (err) {
      console.log(err);
      return helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: err.message });
    }
  },
};
