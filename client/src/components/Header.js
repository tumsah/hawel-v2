// src/components/Header.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { LanguageContext } from "../LanguageContext";

export default function Header() {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { pathname } = useLocation();

  const Item = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded ${pathname === to ? "font-bold" : ""}`}
    >
      {children}
    </Link>
  );

  return (
    <header
      style={{
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,.08)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255,255,255,.7)",
      }}
    >
      <nav
        className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14"
        aria-label="Top"
      >
        <div className="flex items-center gap-2">
          <Link to="/" className="font-extrabold text-lg">Hawel</Link>
          <div className="hidden sm:flex items-center gap-1">
            <Item to="/fees">Fees</Item>
            <Item to="/help">Help</Item>
            <Item to="/track-transfer">Track</Item>
            <Item to="/pdpl">PDPL</Item>
            <Item to="/aml-ctf">AML/CTF</Item>
            <Item to="/about">About</Item>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Item to="/login">Log in</Item>
          <Item to="/register">Register</Item>
          <Item to="/dashboard">Dashboard</Item>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Language switch"
            title="Switch language"
            className="px-3 py-2"
          >
            {language === "en" ? "EN | AR" : "AR | EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}
