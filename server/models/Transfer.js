const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transfer = sequelize.define("Transfer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // allows guest transfers
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sender_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver_contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  usd_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_usd: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_sdg: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  proof_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Transfer;
