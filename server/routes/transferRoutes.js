// server/routes/transferRoutes.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const gccGate = require("../middleware/gccGate");

const Transfer = require("../models/Transfer");
const { v4: uuidv4 } = require("uuid");

/**
 * Public: GET /api/transfers/status/:ref
 * Track a transfer by reference number (no auth required)
 */
router.get("/status/:ref", async (req, res) => {
  try {
    const ref = String(req.params.ref || "").trim();
    if (!ref) return res.status(400).json({ message: "Missing reference." });

    const t = await Transfer.findOne({ where: { reference_number: ref } });
    if (!t) return res.status(404).json({ message: "Not found" });

    // Return minimal safe fields
    return res.json({
      status: t.status,
      receiver_name: t.receiver_name,
      amount: t.amount,
      createdAt: t.createdAt,
      proof_image: t.proof_image || null,
    });
  } catch (err) {
    console.error("status lookup error:", err);
    return res.status(500).json({ message: "Error looking up transfer." });
  }
});

/**
 * GET /api/transfers (protected)
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.json(transfers);
  } catch (err) {
    console.error("Error listing transfers:", err);
    return res.status(500).json({ message: "Error listing transfers." });
  }
});

/**
 * GET /api/transfers/:id (protected)
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found." });
    }
    return res.json(transfer);
  } catch (err) {
    console.error("Error fetching transfer:", err);
    return res.status(500).json({ message: "Error fetching transfer." });
  }
});

/**
 * POST /api/transfers (protected + GCC gate + $5k cap)
 */
router.post("/", verifyToken, gccGate, async (req, res) => {
  const {
    sender_name,
    sender_email,
    sender_address,
    sender_phone,
    receiver_name,
    receiver_contact,
    currency,
    amount,
    usd_amount,
    total_usd,
    total_sdg,
  } = req.body;

  try {
    // Demo cap: USD 5,000 lifetime per customer (sum of usd_amount)
    const LIMIT = 5000;
    const prior = (await Transfer.sum("usd_amount", { where: { user_id: req.user.id } })) || 0;
    const next = Number(usd_amount) || 0;
    if (prior + next > LIMIT) {
      return res.status(400).json({ ok: false, message: "Per-customer demo cap of USD 5,000 reached." });
    }

    const reference_number = uuidv4();
    const transfer = await Transfer.create({
      user_id: req.user.id || null,
      reference_number,
      sender_name,
      sender_email,
      sender_address,
      sender_phone,
      receiver_name,
      receiver_contact,
      currency,
      amount,
      usd_amount,
      total_usd,
      total_sdg,
      status: "pending",
    });

    return res.status(201).json({ reference_number, id: transfer.id });
  } catch (err) {
    console.error("Error creating transfer:", err);
    return res.status(500).json({ message: "Error creating transfer.", error: err.message });
  }
});

/**
 * PUT /api/transfers/:id (protected)
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found." });
    }

    const allowed = [
      "sender_name",
      "sender_email",
      "sender_address",
      "sender_phone",
      "receiver_name",
      "receiver_contact",
      "status",
    ];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    await transfer.update(updates);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating transfer:", err);
    return res.status(500).json({ message: "Error updating transfer." });
  }
});

/**
 * DELETE /api/transfers/:id (protected)
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const count = await Transfer.destroy({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (count === 0) {
      return res.status(404).json({ message: "Transfer not found." });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting transfer:", err);
    return res.status(500).json({ message: "Error deleting transfer." });
  }
});

module.exports = router;
