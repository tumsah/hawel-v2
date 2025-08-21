// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Controller
const authController = require("../controllers/authController");

// Public routes
router.post("/register", authController.register);  // no gccGate here
router.post("/login", authController.login);

// Admin
router.post("/admin/login", authController.adminLogin);

module.exports = router;
