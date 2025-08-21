const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // ✅ This is the correct path

const ExchangeRate = sequelize.define("ExchangeRate", {
  currency: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = ExchangeRate;
