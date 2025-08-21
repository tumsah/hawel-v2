// createAdmin.js
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const User = require("./models/User");

dotenv.config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    const hashed = await bcrypt.hash("A9x!eP$4zQ2m", 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: "admin@hawel.local" },
      defaults: {
        name: "Admin User",
        password: hashed,
        role: "admin",
        isVerified: true,
      },
    });

    if (created) {
      console.log("✅ Admin user created successfully.");
    } else {
      console.log("ℹ️ Admin user already exists.");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
    process.exit(1);
  }
})();
