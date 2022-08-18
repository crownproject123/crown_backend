const User = require("../model/User");

const authRequired = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    var decoded = await helpers.verifyToken(token.split(" ")[1]);

    if (decoded) {
      const { id } = decoded;
      const targetUser = await User.findById(id);
      req.user = targetUser;
      next();
    } else {
      return helpers.createResponse(res, constants.FORBIDDEN, messages.UNAUTHORIZED);
    }
  } catch (err) {
    return helpers.createResponse(res, constants.FORBIDDEN, messages.UNAUTHORIZED);
  }
};

module.exports = {
  authRequired,
};
