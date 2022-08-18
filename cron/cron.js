const cron = require("node-cron");
const cronHelpers = require("../utils/cronHelpers");

module.exports = {
  runCronJob: async () => {
    if (env.CRON_JOB_ENABLED != "true") {
      console.log("Cron jobs are disabled. Can be enabled by updating .env file.");
      return false;
    }

    try {
      // creates the cronjob instance with startScheduler
      const task = cron.schedule(
        "0 0 */7 * *",
        async () => {
          console.log("Cronjob is running");
          await cronHelpers.autoDisableGuardAccounts();
        },
        {
          scheduled: false,
        }
      );

      try {
        // Stop if already running
        task.stop();
      } catch (e) {}

      // starts the scheduler
      task.start();

      console.log("Cron job started successfully");
    } catch (e) {
      console.log(e);
    }
  },
};
