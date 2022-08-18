"use strict";

const Feedback = require("../model/Feedback");
const feedbackValidators = require("../validators/feedbackValidators");
const User = require("../model/User");
const Location = require("../model/Location");

module.exports = {
  createNewFeedback: async (req, res) => {
    try {
      // Validate request data
      let validatedData = feedbackValidators.createNewFeedback(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { feedback, locationId } = validatedData.value;

      // Create new Feedback
      let newFeedback = Feedback();
      newFeedback.user = req.user;
      newFeedback.feedback = feedback;
      newFeedback.location = await Location.findById(locationId);
      await newFeedback.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Feedback"), newFeedback);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllFeedback: async (req, res) => {
    try {
      // Validate request data
      let validatedData = feedbackValidators.getAllFeedback(req.query);
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

      // Get all Feedbacks
      let findQuery = { ...filterQuery, ...searchQuery };
      if (locationId && locationId !== "") {
        findQuery = { ...filterQuery, ...searchQuery, location: locationId };
      }
      const allFeedbacks = await Feedback.find(findQuery).populate("user location").sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Feedback"), allFeedbacks);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleFeedback: async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
      const feedbackData = await Feedback.findById(feedbackId).populate("user location");
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Feedback"), feedbackData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateFeedback: async (req, res) => {
    try {
      // Validate request data
      let validatedData = feedbackValidators.updateFeedback(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { feedback } = validatedData.value;

      const feedbackId = req.params.feedbackId;
      const feedbackData = await Feedback.findById(feedbackId).populate("user location");
      feedbackData.feedback = feedback;
      await feedbackData.save();
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Feedback"), feedbackData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteFeedback: async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
      await Feedback.findOneAndDelete({ _id: feedbackId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Feedback"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
