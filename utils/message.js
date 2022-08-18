"use strict";

module.exports = {
  MODULE_LIST: (module) => {
    return module + "s list";
  },

  MODULE: (module) => {
    return module;
  },

  MODULE_CREATED: (module) => {
    return module + " created successfully";
  },

  MODULE_UPDATED: (module) => {
    return module + " updated successfully";
  },

  MODULE_DELETED: (module) => {
    return module + " deleted successfully";
  },

  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Server error",
  UNAUTHORIZED: "Unauthorized",
  INVALID_CAPTCHA: "Invalid captcha",
  SOMETHING_WENT_WRONG: "Something went wrong",

  // Signup
  EMAIL_ALREADY_EXSIT: "This email is already in use",
  SIGNUP_SUCCESSFULLY: "Signup successfully",

  // Login
  INVALID_LOGIN_CREDENTIALS: "Inavlid login credentials",
  LOGGED_IN_SUCCESSFULLY: "Logged in successfully",
  ACCOUNT_DISABLED: "Your account is disabled",

  // Forgot password
  EMAIL_NOT_ASSOCIATED_WITH_ANY_ACCOUNT: "This email is not associated with any account",
  LINK_SENT_SUCCESSFULLY: "Link sent successfully",
  PASSWORD_UPDATED_SUCCESSFULLY: "Password updated successfully",
  INVALID_TOKEN: "Invalid token",
  ALREADY_USED_TOKEN: "This token is already been used",

  // Attendance
  ALREADY_ADDED_TODAYS_ATTENDANCE_PUNCH_IN: "Already added todays punch in",
  YOU_CANNOT_PUNKCH_IN_OUTSIDE_SHIFT: "You can not punch in outside your shift time",
  ALREADY_ADDED_TODAYS_ATTENDANCE_PUNCH_OUT: "Already added todays punch out",
};
