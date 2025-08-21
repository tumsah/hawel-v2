// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

// List users pending EDD (admin only)
router.get("/pending-edd", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ ok: false });
  const users = await User.findAll({ where: { status: "pending_edd" } });
  res.json({ ok: true, users });
});

// Approve a user (admin)
router.post("/users/:id/approve", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ ok: false });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ ok: false });
  await user.update({ status: "active", canSend: true });
  res.json({ ok: true });
});

// Reject a user (admin)
router.post("/users/:id/reject", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ ok: false });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ ok: false });
  await user.update({ status: "rejected", canSend: false });
  res.json({ ok: true });
});

module.exports = router;
