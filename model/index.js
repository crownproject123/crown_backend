let User = require("./User");
let Attendance = require("./Attendance");
let Feedback = require("./Feedback");
let Issue = require("./Issue");
let SalarySlip = require("./SalarySlip");
let FilledChecklist = require("./FilledChecklist");
let FormResponse = require("./FormResponse");
let Location = require("./Location");
let Shift = require("./Shift");

module.exports = {
  Attendance: Attendance,
  Feedback: Feedback,
  FilledChecklist: FilledChecklist,
  FormResponse: FormResponse,
  Issue: Issue,
  Location: Location,
  SalarySlip: SalarySlip,
  Shift: Shift,
  User: User,
};
