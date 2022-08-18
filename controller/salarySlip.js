"use strict";

const SalarySlip = require("../model/SalarySlip");
const salarySlipValidators = require("../validators/salarySlipValidators");
const User = require("../model/User");
var pdf = require("pdf-creator-node");
var fs = require("fs");
const AWS = require("aws-sdk");

const generateSalarySlipPdf = async (
  salarySlipFileName,

  userId,
  organizationName,
  period,
  issuedAt,
  bankName,
  bankAccountNo,
  location,
  workingDays,
  department,
  designation,

  earning_basicSalary,
  earning_houseRentAllowance,
  gross_earnings,

  deduction_pf,
  deduction_tax,
  gross_deductions,

  net_pay
) => {
  const targetUser = await User.findById(userId);
  var html = fs.readFileSync(salarySlipDirPath + "/template.html", "utf8");
  var options = {
    format: "A3",
    orientation: "portrait",
  };
  var document = {
    html: html,
    data: {
      organizationName: organizationName,

      id: targetUser._id,
      name: targetUser.firstName,
      period: period,
      issuedAt: issuedAt,
      bankName: bankName,
      bankAccountNo: bankAccountNo,
      location: location,
      workingDays: workingDays,
      department: department,
      designation: designation,

      earning_basicSalary: earning_basicSalary,
      earning_houseRentAllowance: earning_houseRentAllowance,

      deduction_pf: deduction_pf,
      deduction_tax: deduction_tax,

      gross_earnings: gross_earnings,
      gross_deductions: gross_deductions,

      net_pay: net_pay,
    },
    path: `${generatedSalarySlipDirPath}/${salarySlipFileName}`,
    type: "",
  };
  await pdf.create(document, options);
};

module.exports = {
  createNewSalarySlip: async (req, res) => {
    try {
      // Validate request data
      let validatedData = salarySlipValidators.createNewSalarySlip(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }

      // Get validated data
      const {
        userId,
        organizationName,
        period,
        issuedAt,
        bankName,
        bankAccountNo,
        location,
        workingDays,
        department,
        designation,

        earning_basicSalary,
        earning_houseRentAllowance,
        gross_earnings,

        deduction_pf,
        deduction_tax,
        gross_deductions,

        net_pay,
      } = validatedData.value;

      // Create new SalarySlip
      const targetUser = await User.findById(userId);
      const salarySlipFileName = `Salary slip ${period} ${targetUser._id}-U${await helpers.makeid(3)}.pdf`;
      await generateSalarySlipPdf(
        salarySlipFileName,

        userId,
        organizationName,
        period,
        issuedAt,
        bankName,
        bankAccountNo,
        location,
        workingDays,
        department,
        designation,

        earning_basicSalary,
        earning_houseRentAllowance,
        gross_earnings,

        deduction_pf,
        deduction_tax,
        gross_deductions,

        net_pay
      );

      // Upload to AWS S3
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const fileContent = fs.readFileSync(`${generatedSalarySlipDirPath}/${salarySlipFileName}`);

      const params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: salarySlipFileName,
        Body: fileContent,
      };

      const uploadedFileData = await s3.upload(params).promise();
      const uploadedFileURL = uploadedFileData.Location;

      // Save salary slip
      let newSalarySlip = SalarySlip();
      newSalarySlip.user = targetUser;
      newSalarySlip.createdBy = req.user;
      newSalarySlip.url = uploadedFileURL;
      await newSalarySlip.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_CREATED("Salary Slip"), newSalarySlip);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getAllSalarySlip: async (req, res) => {
    try {
      // Validate request data
      let validatedData = salarySlipValidators.getAllSalarySlip(req.query);
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

      // Get all SalarySlips
      const allSalarySlips = await SalarySlip.find({ ...filterQuery, ...searchQuery }).sort(orderByQuery);

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_LIST("Salary Slip"), allSalarySlips);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  getSingleSalarySlip: async (req, res) => {
    try {
      const salarySlipId = req.params.salarySlipId;
      const salarySlipData = await SalarySlip.findById(salarySlipId);
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Salary Slip"), salarySlipData);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },

  deleteSalarySlip: async (req, res) => {
    try {
      const salarySlipId = req.params.salarySlipId;
      await SalarySlip.findOneAndDelete({ _id: salarySlipId });
      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE_DELETED("Salary Slip"));
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
