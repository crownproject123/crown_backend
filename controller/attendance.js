"use strict";

const Attendance = require("../model/Attendance");
const attendanceValidators = require("../validators/attendanceValidators");
const User = require("../model/User");
const Location = require("../model/Location");
const Shift = require("../model/Shift");

module.exports = {
  createNewAttendance: async (req, res) => {
    try {
      var now = new Date();
      var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startOfToday.setUTCHours(0, 0, 0, 0);
      console.log(startOfToday);

      const { type, locationId } = req.body;

      if (
        type === "punch-in" &&
        (await Shift.countDocuments({ user: req.user, location: locationId, start: { $lte: new Date() }, end: { $gte: new Date() } })) === 0
      ) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.YOU_CANNOT_PUNKCH_IN_OUTSIDE_SHIFT);
      }

      if ((await Attendance.countDocuments({ user: req.user, type: "punch-in", createdAt: { $gte: startOfToday } })) === 0) {
        let newAttendance = Attendance();
        newAttendance.user = req.user;
        newAttendance.type = type;
        newAttendance.location = await Location.findById(locationId);
        await newAttendance.save();

        return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Attendance"), newAttendance);
      }

      if ((await Attendance.countDocuments({ user: req.user, type: "punch-out", createdAt: { $gte: startOfToday } })) === 0) {
        let newAttendance = Attendance();
        newAttendance.user = req.user;
        newAttendance.type = type;
        newAttendance.location = await Location.findById(locationId);
        await newAttendance.save();

        return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Attendance"), newAttendance);
      }

      if (type === "punch-in") {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.ALREADY_ADDED_TODAYS_ATTENDANCE_PUNCH_IN);
      }

      if (type === "punch-out") {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.ALREADY_ADDED_TODAYS_ATTENDANCE_PUNCH_OUT);
      }
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  createAttendanceManually: async (req, res) => {
    try {
      var now = new Date();
      var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startOfToday.setUTCHours(0, 0, 0, 0);
      console.log(startOfToday);

      const { type, locationId, userId, createdAt } = req.body;

      let newAttendance = Attendance();
      newAttendance.user = await User.findById(userId);
      newAttendance.type = type;
      newAttendance.location = await Location.findById(locationId);
      newAttendance.createdAt = createdAt;
      await newAttendance.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Attendance"), newAttendance);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllAttendance: async (req, res) => {
    try {
      // Validate request data
      let validatedData = attendanceValidators.getAllAttendance(req.query);
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

      // Get all Attendances
      const allAttendances = await Attendance.find({ ...filterQuery, ...searchQuery }).sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Attendance"), allAttendances);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleAttendance: async (req, res) => {
    try {
      const attendanceId = req.params.attendanceId;
      const attendanceData = await Attendance.findById(attendanceId);
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Attendance"), attendanceData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const attendanceId = req.params.attendanceId;
      await Attendance.findOneAndDelete({ _id: attendanceId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Attendance"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
