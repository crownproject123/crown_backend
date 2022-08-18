// Create Express App
const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Load .env
require("dotenv").config();

// Environment Variables
require("dotenv").config();
env = module.exports = process.env;

// Database
require("./db/conn");
require("./model");

// Logger
logger = (req, res, next) => {
  console.log("\x1b[32m", `-------------- ${req.path} --------------`);
  console.log("\x1b[33m", "Headers contains authorization: ", Object.keys(req.headers).includes("authorization"));
  console.log("\x1b[33m", "Method : ", req.method);
  console.log("\x1b[33m", "Path : ", req.path);
  console.log("\x1b[33m", "Body : ", JSON.stringify(req.body));
  console.log("\x1b[33m", "Query Params : ", req.query);
  console.log("\x1b[32m", "-----------------------------------------");
  console.log("");

  next();
};
app.use(logger);

// Global helpers
messages = module.exports = require("./utils/message");
constants = module.exports = require("./utils/constants");
helpers = module.exports = require("./utils/helper");
authRequired = module.exports = require("./utils/authentication").authRequired;

// Create dirs
const fs = require("fs");
const path = require("path");

global.__staticFilesdir = path.join(__dirname, "public");
global.profilePictureDir = "/profile_pictures";
global.profilePictureDirPath = __staticFilesdir + profilePictureDir;
global.emailDir = "/email";
global.emailDirPath = __staticFilesdir + emailDir;
global.salarySlipDir = "/salary-slip";
global.salarySlipDirPath = __staticFilesdir + salarySlipDir;
global.generatedSalarySlipDir = "/generated-salary-slip";
global.generatedSalarySlipDirPath = __staticFilesdir + generatedSalarySlipDir;

if (!fs.existsSync(__staticFilesdir)) {
  fs.mkdirSync(__staticFilesdir, { recursive: true });
}

if (!fs.existsSync(generatedSalarySlipDirPath)) {
  fs.mkdirSync(generatedSalarySlipDirPath, { recursive: true });
}

if (!fs.existsSync(salarySlipDirPath)) {
  fs.mkdirSync(salarySlipDirPath, { recursive: true });
}

if (!fs.existsSync(profilePictureDirPath)) {
  fs.mkdirSync(profilePictureDirPath, { recursive: true });
}

if (!fs.existsSync(emailDirPath)) {
  fs.mkdirSync(emailDirPath, { recursive: true });
}

// Enable static files
app.use(express.static(__staticFilesdir));

// Routes
const authorizationRouter = require("./routes/authorization");
const attendanceRouter = require("./routes/attendance");
const issueRouter = require("./routes/issue");
const accessoryRouter = require("./routes/accessory");
const feedbackRouter = require("./routes/feedback");
const formResponseRouter = require("./routes/formResponse");
const salarySlipRouter = require("./routes/salarySlip");
const userRouter = require("./routes/user");
const locationRouter = require("./routes/location");
const filledChecklistRouter = require("./routes/filledChecklist");
const shiftRouter = require("./routes/shift");
const fcmRouter = require("./routes/fcm");

const API_VERSION = "/api/v1/";
app.use(API_VERSION + "auth", authorizationRouter);
app.use(API_VERSION + "attendances", attendanceRouter);
app.use(API_VERSION + "issues", issueRouter);
app.use(API_VERSION + "accessories", accessoryRouter);
app.use(API_VERSION + "feedbacks", feedbackRouter);
app.use(API_VERSION + "form-responses", formResponseRouter);
app.use(API_VERSION + "salary-slips", salarySlipRouter);
app.use(API_VERSION + "users", userRouter);
app.use(API_VERSION + "locations", locationRouter);
app.use(API_VERSION + "filledChecklists", filledChecklistRouter);
app.use(API_VERSION + "shifts", shiftRouter);
app.use(API_VERSION + "fcm", fcmRouter);

// 404 Not found routes
app.use((req, res) => {
  console.log("\x1b[35m", `-------------- 404 - Not Found - ${req.path} --------------`);
  console.log("\x1b[35m", "Headers contains authorization: ", Object.keys(req.headers).includes("authorization"));
  console.log("\x1b[35m", "Method : ", req.method);
  console.log("\x1b[35m", "Path : ", req.path);
  console.log("\x1b[35m", "Body : ", JSON.stringify(req.body));
  console.log("\x1b[35m", "Query Params : ", req.query);
  console.log("\x1b[35m", "-----------------------------------------");

  helpers.createResponse(res, constants.NOT_FOUND, messages.URL_NOT_FOUND, {
    error: messages.URL_NOT_FOUND,
  });
});

// Cron
const cron = require("./cron/cron.js");

// Listen
app.listen(3000, () => {
  cron.runCronJob();
  console.log("Server is running on port 3000");
});
