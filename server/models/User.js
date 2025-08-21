// server/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: { type: DataTypes.STRING },

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  password: { type: DataTypes.STRING },

  role: {
    type: DataTypes.STRING,
    defaultValue: "user", // "user" or "admin"
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // --- Added for residency + EDD/manual review flow ---
  residencyCountryCode: {
    type: DataTypes.STRING(2),
    allowNull: true,
    validate: { len: [2, 2] },
  },
  status: {
    type: DataTypes.ENUM("active_candidate", "pending_edd", "active", "rejected"),
    defaultValue: "active_candidate",
    allowNull: false,
  },
  canSend: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  screeningStatus: {
    type: DataTypes.ENUM("pending", "clear", "hit"),
    defaultValue: "pending",
    allowNull: false,
  },
  // -----------------------------------------------------

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;