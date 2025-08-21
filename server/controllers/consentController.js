// controllers/consentController.js
const ConsentLog = require('../models/ConsentLog');

exports.saveUserConsent = async (req, res) => {
  try {
    const { type, textHash } = req.body;

    // basic field checks (we'll fully validate later during testing pass)
    if (!type || !textHash) {
      return res.status(400).json({ ok:false, message: 'Missing type or textHash' });
    }

    // userId is optional (may be null if user is not logged in)
    const userId = req.user?.id || null;

    await ConsentLog.create({
      userId,
      type,
      textHash,
      ip: req.ip,
      ua: req.get('user-agent')
    });

    return res.json({ ok:true });
  } catch (err) {
    console.error('saveUserConsent error:', err);
    return res.status(500).json({ ok:false, message:'Could not save consent' });
  }
};
