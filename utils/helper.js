"use strict";
const jwt = require("jsonwebtoken");
let User = require("../model/User");
var FCM = require("fcm-node");

module.exports = {
  // Create custom response for rest APIs
  createResponse: (res, status, message, payload, pager) => {
    return res.status(status).json({
      message: message,
      payload: payload,
      pager: pager,
    });
  },

  // JWT token functions
  generateToken: (data, setExpiry) => {
    if (!setExpiry) {
      return jwt.sign(data, env.JWT_SECRET, {
        algorithm: env.JWT_ALGORITHM,
      });
    } else {
      return jwt.sign(data, env.JWT_SECRET, {
        expiresIn: env.TOKEN_EXPIRY,
        algorithm: env.JWT_ALGORITHM,
      });
    }
  },

  verifyToken: async (token) => {
    try {
      var decoded = jwt.verify(token, env.JWT_SECRET);
      if (decoded) return decoded;
      else return false;
    } catch (err) {
      return false;
    }
  },

  // Get user basic info
  getUserBasicInfo: async (id) => {
    try {
      const userData = await User.findOne({ _id: id }, "id email firstName lastName createdBy accessories location updatedAt createdAt");
      return userData;
    } catch (err) {
      return false;
    }
  },

  makeid: async (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  // FCM
  sendFCMNotification: (registration_token, title, body, data) => {
    var serverKey = env.FCM_SERVER_KEY;
    var fcm = new FCM(serverKey);

    var message = {
      to: registration_token,
      collapse_key: env.COLLAPSE_KEY,

      notification: {
        title: title,
        body: body,
      },

      data: {
        ...data,
      },
    };

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  },
};
