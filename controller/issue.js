"use strict";

const Issue = require("../model/Issue");
const issueValidators = require("../validators/issueValidators");
const User = require("../model/User");
const Location = require("../model/Location");

module.exports = {
  createNewIssue: async (req, res) => {
    try {
      // Validate request data
      let validatedData = issueValidators.createNewIssue(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { issue, locationId } = validatedData.value;

      // Create new Issue
      let newIssue = Issue();
      newIssue.user = req.user;
      newIssue.issue = issue;
      newIssue.location = await Location.findById(locationId);
      await newIssue.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Issue"), newIssue);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllIssue: async (req, res) => {
    try {
      // Validate request data
      let validatedData = issueValidators.getAllIssue(req.query);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { search, filter, orderBy, locationId } = validatedData.value;

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

      // Get all Issues
      let findQuery = { ...filterQuery, ...searchQuery };
      if (locationId && locationId !== "") {
        findQuery = { ...filterQuery, ...searchQuery, location: locationId };
      }
      const allIssues = await Issue.find(findQuery).populate("user location").sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Issue"), allIssues);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleIssue: async (req, res) => {
    try {
      const issueId = req.params.issueId;
      const issueData = await Issue.findById(issueId).populate("user location");
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Issue"), issueData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateIssue: async (req, res) => {
    try {
      // Validate request data
      let validatedData = issueValidators.updateIssue(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { issue } = validatedData.value;

      const issueId = req.params.issueId;
      const issueData = await Issue.findById(issueId).populate("user location");
      issueData.issue = issue;
      await issueData.save();
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Issue"), issueData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteIssue: async (req, res) => {
    try {
      const issueId = req.params.issueId;
      await Issue.findOneAndDelete({ _id: issueId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Issue"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
