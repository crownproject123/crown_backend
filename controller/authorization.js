"use strict";

const authenticationValidators = require("../validators/authenticationValidators");
let User = require("../model/User");
const bcrypt = require("bcryptjs");
const Location = require("../model/Location");

module.exports = {
  createdAdmin: async (req, res) => {
    try {
      // Validate request data
      let validatedData = authenticationValidators.createAdmin(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.VALIDATION_ERROR, validatedData.error.details);
      }

      // Get validated data
      const { email, password, firstName, lastName } = validatedData.value;

      // Create User
      const tempuser = await User.findOne({ email: email });
      if (tempuser) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.EMAIL_ALREADY_EXSIT);
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
        role: "admin",
      });

      await user.save();

      // Response
      return helpers.createResponse(res, constants.SUCCESS, messages.SIGNUP_SUCCESSFULLY);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  login: async (req, res) => {
    try {
      // Validate request data
      let validatedData = authenticationValidators.login(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { email, password } = validatedData.value;

      // Check if this user exists
      const user = await User.findOne({ email });
      if (!user) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.INVALID_LOGIN_CREDENTIALS);
      }

      if (user.disabled) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.ACCOUNT_DISABLED);
      }

      // Match password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.INVALID_LOGIN_CREDENTIALS);
      }

      // Log in the user
      const token = await helpers.generateToken({ id: user.id });
      const userData = await helpers.getUserBasicInfo(user._id);

      return helpers.createResponse(res, constants.SUCCESS, messages.LOGGED_IN_SUCCESSFULLY, {
        token: token,
        user: userData,
      });
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  sendForgotPasswordLink: async (req, res) => {
    try {
      // Validate request data
      let validatedData = authenticationValidators.sendForgotPasswordLink(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { email } = validatedData.value;

      // Check if this user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.EMAIL_NOT_ASSOCIATED_WITH_ANY_ACCOUNT);
      }

      // Generate new reset password token
      const resetPasswordToken = await helpers.makeid(32);
      user.reset_password_token = resetPasswordToken;
      user.reset_password_token_used = false;
      await user.save();
      console.log(resetPasswordToken);

      // TODO: send reset password link via email

      return helpers.createResponse(res, constants.SUCCESS, messages.LINK_SENT_SUCCESSFULLY);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  setNewPassword: async (req, res) => {
    try {
      // Validate request data
      let validatedData = authenticationValidators.setNewPassword(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const { token, newPassword } = validatedData.value;

      // Check if this user exists
      const user = await User.findOne({ reset_password_token: token });
      if (!user) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.INVALID_TOKEN);
      }

      // Check if token is already used
      if (user.reset_password_token_used == true) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.ALREADY_USED_TOKEN);
      }

      // Update password
      user.reset_password_token_used = true;
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.PASSWORD_UPDATED_SUCCESSFULLY);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
