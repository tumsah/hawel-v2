// server/routes/exchangeRateRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const ExchangeRate = require("../models/ExchangeRate");

// Get all exchange rates (public)
router.get("/", async (_req, res) => {
  try {
    const rates = await ExchangeRate.findAll();
    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exchange rates." });
  }
});

// Update a currency's rate (admin only)
router.put("/:currency", verifyToken, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const { currency } = req.params;
    const { rate } = req.body;
    const row = await ExchangeRate.findByPk(currency);
    if (!row) return res.status(404).json({ message: "Currency not found." });
    await row.update({ rate });
    res.json(row);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating exchange rate." });
  }
});

module.exports = router;
