// server/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

/**
 * Demo-only: payments are disabled (no Stripe).
 * Keep this route so the frontend doesn't 404.
 * Return a clear 501 status so the UI can show a friendly message.
 */

router.post("/create-session", (req, res) => {
  return res.status(501).json({
    ok: false,
    code: "PAYMENTS_DISABLED",
    message:
      "Payments are disabled in this demo. Please contact support@hawelmoney.com if you need this enabled.",
  });
});

// (Optionally add a ping/health route)
router.get("/health", (_req, res) => res.json({ ok: true, payments: "disabled" }));

module.exports = router;
