// server/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // if missing: npm i bcryptjs
const User = require("../models/User");

const GCC = new Set(["BH", "SA", "AE", "KW", "OM", "QA"]);

function normalize(code) {
  if (!code || typeof code !== "string") return "";
  return code.trim().toUpperCase();
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      residencyCountryCode: user.residencyCountryCode || null,
      canSend: !!user.canSend,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
}

exports.register = async (req, res) => {
  try {
    const { email, password, name, residencyCountryCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);

    const code = normalize(residencyCountryCode);
    const isGCC = GCC.has(code);

    // If GCC → active + canSend; else → pending_edd + cannot send
    const newUser = await User.create({
      email,
      password: hash,           // assuming your User model uses `password`
      name: name || null,
      role: "user",
      residencyCountryCode: code || null,
      status: isGCC ? "active" : "pending_edd",
      canSend: !!isGCC,
      screeningStatus: "pending",
    });

    // Return same message you’ve seen before, plus EDD hint if non-GCC
    if (!isGCC) {
      return res.status(202).json({
        message: "Registration received. EDD/manual review required before you can send.",
      });
    }

    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed." });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden." });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ message: "Admin login failed." });
  }
};
