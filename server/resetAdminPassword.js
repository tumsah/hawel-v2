const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const User = require("./models/User");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB");

    const user = await User.findOne({ where: { email: "admin@hawel.local" } });
    if (!user) {
      console.log("Admin user not found");
      return;
    }

    const hashedPassword = await bcrypt.hash("A9x!eP$4zQ2m", 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Admin password reset to: A9x!eP$4zQ2m");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
})();
