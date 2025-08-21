// server/middleware/gccGate.js
const User = require("../models/User");

const GCC = new Set(["BH", "SA", "AE", "KW", "OM", "QA"]);

function normalize(code) {
  if (!code || typeof code !== "string") return "";
  return code.trim().toUpperCase();
}

module.exports = async function gccGate(req, res, next) {
  try {
    // 1) Try request body
    let code = normalize(req.body?.residencyCountryCode);

    // 2) Try token payload
    if (!code) {
      code = normalize(req.user?.residencyCountryCode);
    }

    // 3) As a fallback, load from DB using the authenticated user id
    if (!code && req.user?.id) {
      const user = await User.findByPk(req.user.id, {
        attributes: ["residencyCountryCode"],
      });
      code = normalize(user?.residencyCountryCode);
    }

    // If still no GCC code, require EDD/manual review
    if (!code || !GCC.has(code)) {
      return res.status(202).json({
        ok: false,
        gate: "edd_required",
        message:
          "EDD/manual review required for non-GCC residency. Online sending disabled until approved.",
        next: "support_contact",
      });
    }

    return next();
  } catch (err) {
    console.error("gccGate error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "GCC gate error. Please try again." });
  }
};
