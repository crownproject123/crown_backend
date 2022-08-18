"use strict";

const User = require("../model/User");
const Location = require("../model/Location");
const userValidators = require("../validators/userValidators");
const bcrypt = require("bcryptjs");

module.exports = {
  createNewUser: async (req, res) => {
    try {
      // Validate request data
      let validatedData = userValidators.createNewUser(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.VALIDATION_ERROR, validatedData.error.details);
      }

      // Get validated data
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        locationId,
        doj,
        dob,
        designation,
        gender,
        fatherOrHusbandName,
        motherOrOtherFamilyMemberName,
        address,
        contactNo,
        alternateNo,
        nameAsOnAadhar,
        pan,
        pcc,
        idStatus,
        bankAccountNo,
        bankIFSC,
      } = validatedData.value;

      // Create User
      const tempuser = await User.findOne({ email: email });
      if (tempuser) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.EMAIL_ALREADY_EXSIT);
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        createdBy: req.user,
        doj,
        dob,
        designation,
        gender,
        fatherOrHusbandName,
        motherOrOtherFamilyMemberName,
        address,
        contactNo,
        alternateNo,
        nameAsOnAadhar,
        pan,
        pcc,
        idStatus,
        bankAccountNo,
        bankIFSC,
      });

      if (locationId && locationId !== "") {
        newUser.location = await Location.findById(locationId);
      }

      await newUser.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("User"), newUser);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllUser: async (req, res) => {
    try {
      // Validate request data
      let validatedData = userValidators.getAllUser(req.query);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { search, filter, orderBy, role } = validatedData.value;

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

      if (role && role !== "") {
        searchQuery = { ...searchQuery, role };
      }

      // Apply Order by
      const orderByQuery = {};
      if (orderBy && orderBy !== "") {
        const orderByArr = orderBy.split(":");
        const key = orderByArr[0];
        const value = orderByArr[1];
        orderByQuery[key] = value;
      }

      // Get all Users
      const allUsers = await User.find({ ...filterQuery, ...searchQuery })
        .populate("location")
        .sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("User"), allUsers);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getMe: async (req, res) => {
    try {
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("User"), req.user);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const userData = await User.findById(userId).populate("location");
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("User"), userData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      // Validate request data
      let validatedData = userValidators.updateUser(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const {
        email,
        password,
        firstName,
        lastName,
        locationId,
        disabled,
        doj,
        dob,
        designation,
        gender,
        fatherOrHusbandName,
        motherOrOtherFamilyMemberName,
        address,
        contactNo,
        alternateNo,
        nameAsOnAadhar,
        pan,
        pcc,
        idStatus,
        bankAccountNo,
        bankIFSC,
      } = validatedData.value;

      const userId = req.params.userId;
      const userData = await User.findById(userId).populate("location");

      // Update
      if (locationId && locationId !== "") {
        userData.location = await Location.findById(locationId);
      }

      if (firstName && firstName !== "") {
        userData.firstName = firstName;
      }

      if (lastName && lastName !== "") {
        userData.lastName = lastName;
      }

      if (email && email !== "") {
        userData.email = email;
      }

      if (disabled == false || disabled == true) {
        userData.disabled = disabled;
      }

      if (pcc == false || pcc == true) {
        userData.pcc = pcc;
      }

      if (idStatus == false || idStatus == true) {
        userData.idStatus = idStatus;
      }

      if (doj && doj !== "") {
        userData.doj = doj;
      }

      if (dob && dob !== "") {
        userData.dob = dob;
      }

      if (designation && designation !== "") {
        userData.designation = designation;
      }

      if (gender && gender !== "") {
        userData.gender = gender;
      }

      if (fatherOrHusbandName && fatherOrHusbandName !== "") {
        userData.fatherOrHusbandName = fatherOrHusbandName;
      }

      if (motherOrOtherFamilyMemberName && motherOrOtherFamilyMemberName !== "") {
        userData.motherOrOtherFamilyMemberName = motherOrOtherFamilyMemberName;
      }

      if (address && address !== "") {
        userData.address = address;
      }

      if (contactNo && contactNo !== "") {
        userData.contactNo = contactNo;
      }

      if (alternateNo && alternateNo !== "") {
        userData.alternateNo = alternateNo;
      }

      if (nameAsOnAadhar && nameAsOnAadhar !== "") {
        userData.nameAsOnAadhar = nameAsOnAadhar;
      }

      if (pan && pan !== "") {
        userData.pan = pan;
      }

      if (bankAccountNo && bankAccountNo !== "") {
        userData.bankAccountNo = bankAccountNo;
      }

      if (bankIFSC && bankIFSC !== "") {
        userData.bankIFSC = bankIFSC;
      }

      if (password) {
        userData.password = await bcrypt.hash(password, 10);
      }

      await userData.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("User"), userData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      await User.findOneAndDelete({ _id: userId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("User"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
