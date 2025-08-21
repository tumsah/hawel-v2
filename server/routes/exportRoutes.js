// server/routes/exportRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Transfer = require("../models/Transfer");
const ConsentLog = require("../models/ConsentLog");
const json2csv = require("json2csv");

function isAdmin(req) {
  return req.user && req.user.role === "admin";
}

// /api/transfers.csv (admin only)
router.get("/transfers.csv", verifyToken, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden" });
  try {
    const transfers = await Transfer.findAll();
    const fields = [
      "id",
      "user_id",
      "reference_number",
      "sender_name",
      "receiver_name",
      "amount",
      "currency",
      "usd_amount",
      "total_usd",
      "total_sdg",
      "status",
      "createdAt",
      "updatedAt",
    ];
    const csv = json2csv.parse(transfers.map((t) => t.toJSON()), { fields });
    res.header("Content-Type", "text/csv");
    res.attachment("transfers.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export transfers." });
  }
});

// /api/consents.csv (admin only)
router.get("/consents.csv", verifyToken, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden" });
  try {
    const consents = await ConsentLog.findAll();
    const fields = ["id", "userId", "type", "textHash", "ip", "ua", "createdAt"];
    const csv = json2csv.parse(consents.map((c) => c.toJSON()), { fields });
    res.header("Content-Type", "text/csv");
    res.attachment("consents.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export consents." });
  }
});

module.exports = router;
