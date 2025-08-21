// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

// Load environment variables
dotenv.config();

const app = express();

// Load Routes (moved above first app.use so they're initialized before use)
const authRoutes = require("./routes/authRoutes");
const consentRoutes = require("./routes/consentRoutes");
const transferRoutes = require("./routes/transferRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ Only this
const exportRoutes = require("./routes/exportRoutes");
const exchangeRateRoutes = require("./routes/exchangeRateRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ added

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/consents", consentRoutes);

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes); // ✅ This is where Stripe POST endpoint is mounted (stubbed)
app.use("/api", exportRoutes);
app.use("/api/exchange-rates", exchangeRateRoutes);
app.use("/api/admin", adminRoutes); // ✅ added

// Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Load Models
const User = require("./models/User");
const Transfer = require("./models/Transfer");
const Ticket = require("./models/Ticket");
const ExchangeRate = require("./models/ExchangeRate");

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Sync Models and Ensure Default Data
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("✅ All models synchronized");

    // Insert default exchange rates if not exist
    const currencies = [
      { currency: "AED", rate: 0.27 },
      { currency: "QAR", rate: 0.27 },
      { currency: "BHD", rate: 2.65 },
      { currency: "OMR", rate: 2.60 },
      { currency: "KWD", rate: 3.26 },
      { currency: "SAR", rate: 0.27 },
    ];

    for (const curr of currencies) {
      await ExchangeRate.findOrCreate({
        where: { currency: curr.currency },
        defaults: { rate: curr.rate },
      });
    }

    console.log("✅ Default exchange rates ensured.");
  })
  .catch((err) => console.error("❌ Model sync failed:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌿 Server running on port ${PORT}`);
});
