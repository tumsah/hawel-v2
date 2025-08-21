// routes/consentRoutes.js
const express = require('express');
const router = express.Router();
const { saveUserConsent } = require('../controllers/consentController');

// OPTIONAL: if you have authMiddleware, we can attach user info when logged-in users submit consent.
// If you don’t want auth here, just comment the line below and the `auth` usage in the route.
let auth;
try {
  auth = require('../authMiddleware'); // adjust path if your middleware lives elsewhere
} catch {
  auth = null;
}

// POST /api/consents
// Body: { type: 'pdpl_privacy' | 'aml_terms' | 'cookies', textHash: 'sha256-of-policy-text' }
router.post('/', auth ? auth : (req,res,next)=>next(), saveUserConsent);

module.exports = router;
