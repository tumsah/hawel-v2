// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Shared UI
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import MakeTransfer from "./pages/MakeTransfer";
import TrackTransfer from "./pages/TrackTransfer";
import Support from "./pages/Support";   // <- we'll use this for /help too
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";

// Simple info pages
import PDPL from "./pages/PDPL";
import AML from "./pages/AML";
import Fees from "./pages/Fees";
// NOTE: No import for Help.js — /help will render <Support />
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Core */}
        <Route path="/" element={<Home />} />
        <Route path="/make-transfer" element={<MakeTransfer />} />
        <Route path="/track-transfer" element={<TrackTransfer />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Info */}
        <Route path="/pdpl" element={<PDPL />} />
        <Route path="/aml-ctf" element={<AML />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/help" element={<Support />} />     {/* <- Use Support component */}
        <Route path="/support" element={<Support />} />  {/* <- Also works if someone hits /support */}
        <Route path="/about" element={<About />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
