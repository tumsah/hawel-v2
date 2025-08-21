// server/routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Ticket = require("../models/Ticket");

// Create ticket (user)
router.post("/", verifyToken, async (req, res) => {
  const { message } = req.body;
  try {
    const ticket = await Ticket.create({
      user_id: req.user.id,
      user_email: req.user.email,
      subject: "Support Ticket",
      message,
      status: "open",
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Error creating ticket." });
  }
});

// List tickets (admin gets all; user sees own)
router.get("/", verifyToken, async (req, res) => {
  try {
    const where = req.user?.role === "admin" ? {} : { user_id: req.user.id };
    const tickets = await Ticket.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Error fetching tickets." });
  }
});

// Get single ticket
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const where =
      req.user?.role === "admin"
        ? { id: req.params.id }
        : { id: req.params.id, user_id: req.user.id };
    const ticket = await Ticket.findOne({ where });
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    res.json(ticket);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ message: "Error fetching ticket." });
  }
});

// Update ticket status (admin only)
router.put("/:id/status", verifyToken, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const { status } = req.body;
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    await ticket.update({ status });
    res.json({ message: "Ticket status updated.", ticket });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ message: "Error updating ticket status." });
  }
});

module.exports = router;
