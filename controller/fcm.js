"use strict";

const User = require("../model/User");
const Location = require("../model/Location");
const userValidators = require("../validators/userValidators");
const bcrypt = require("bcryptjs");

module.exports = {
  registerFCMDevice: async (req, res) => {
    try {
      req.user.fcmToken = req.body.fcmToken;
      await req.user.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_UPDATED("FCM Token"), req.user);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  unregisterFCMDevice: async (req, res) => {
    try {
      const userId = req.params.userId;
      const targetUser = await User.findById(userId);
      targetUser.fcmToken = null;
      await targetUser.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("FCM Token"), targetUser);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  send: async (req, res) => {
    try {
      const { userId, title, body, data } = req.body;
      const targetUser = await User.findById(userId);

      helpers.sendFCMNotification(targetUser.fcmToken, title, body, data);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("FCM notification sent successfully"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
