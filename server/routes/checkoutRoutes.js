// server/routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/**
 * Demo-only: checkout is disabled (no Stripe).
 */
router.post("/", verifyToken, (req, res) => {
  return res.status(501).json({
    ok: false,
    code: "CHECKOUT_DISABLED",
    message: "Checkout is disabled in this demo.",
  });
});

router.post("/confirm", verifyToken, (req, res) => {
  return res.status(501).json({
    ok: false,
    code: "CHECKOUT_DISABLED",
    message: "Checkout confirm is disabled in this demo.",
  });
});

module.exports = router;



