// models/ConsentLog.js  (Sequelize example)
// server/models/ConsentLog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // ✅ fixed path

const ConsentLog = sequelize.define(
  "ConsentLog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    type: {
      type: DataTypes.ENUM("pdpl_privacy", "aml_terms", "cookies"),
      allowNull: false,
    },
    textHash: { type: DataTypes.STRING, allowNull: false },
    ip: { type: DataTypes.STRING },
    ua: { type: DataTypes.STRING },
  },
  {
    tableName: "ConsentLogs",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = ConsentLog;
