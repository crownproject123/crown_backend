"use strict";

const accessoryValidators = require("../validators/accessoryValidators");
const User = require("../model/User");

module.exports = {
  updateAccessory: async (req, res) => {
    try {
      // Validate request data
      let validatedData = accessoryValidators.updateAccessory(req.body);
      if (Object.keys(validatedData).includes("error")) {
        return helpers.createResponse(res, constants.BAD_REQUEST, messages.MODULE("Validation Error"), validatedData.error.details);
      }
      // Get validated data
      const { accessories, userId } = validatedData.value;

      // Update Accessories
      const targetUser = await User.findById(userId);
      const accessoriesInJson = JSON.parse(accessories);
      targetUser.accessories = accessoriesInJson;
      await targetUser.save();

      return helpers.createResponse(res, constants.SUCCESS, messages.MODULE("Accessory"), targetUser);
    } catch (e) {
      console.log(e);
      helpers.createResponse(res, constants.SERVER_ERROR, messages.SERVER_ERROR, { error: e.message });
    }
  },
};
