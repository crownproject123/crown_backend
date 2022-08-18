const User = require("../model/User");
const Attendance = require("../model/Attendance");
const moment = require("moment");

module.exports = {
  autoDisableGuardAccounts: async () => {
    const allGuards = await User.find({ role: "guard" });

    await Promise.all(
      allGuards.map(async (guard) => {
        var new_date = moment(new Date(), "DD-MM-YYYY").subtract("days", env.AUTO_DISABLE_IN_DAYS);
        if (guard.disabled === false && (await Attendance.countDocuments({ user: guard, type: "punch-in", createdAt: { $gt: new_date } })) === 0) {
          guard.disabled = true;
          await guard.save();
          console.log(guard);
        }
      })
    );
  },
};
