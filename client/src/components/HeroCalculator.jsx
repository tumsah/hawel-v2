// src/components/HeroCalculator.jsx
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./hero-calculator.module.css";
import { LanguageContext } from "../LanguageContext";

// Currency -> country code mapping for flags (extend as you add currencies)
const CCY = {
  USD: { cc: "us", label: "United States" },
  SDG: { cc: "sd", label: "Sudan" },
  BHD: { cc: "bh", label: "Bahrain" },
};

// Build a small, crisp flag image URL (served globally via CDN)
function flagSrc(cc) {
  // 24x18 for normal, 48x36 for HiDPI
  return {
    src: `https://flagcdn.com/24x18/${cc}.png`,
    srcSet: `https://flagcdn.com/48x36/${cc}.png 2x`,
  };
}

function CurrencyPill({ currency = "USD" }) {
  const info = CCY[currency] || { cc: "xx", label: currency };
  const { src, srcSet } = flagSrc(info.cc);

  return (
    <span className={styles.ccyPill} aria-label={`${currency} currency`}>
      <img
        className={styles.flagImg}
        src={src}
        srcSet={srcSet}
        width={18}
        height={14}
        alt={`${info.label} flag`}
        loading="lazy"
      />
      <span className={styles.ccyCode}>{currency}</span>
      <span className={styles.chev} aria-hidden="true">▾</span>
    </span>
  );
}

function RateBadge({ text = "First Transfer Rate 🎉" }) {
  return <span className={styles.rateBadge}>{text}</span>;
}

export default function HeroCalculator({
  variant = "dark",
  logoSrc = "/logo.png",
  onMakeTransfer = () => (window.location.href = "/make-transfer"),
  onTrack = () => (window.location.href = "/track-transfer"),
  onRegister = () => (window.location.href = "/register"),
  onLogin = () => (window.location.href = "/login"),
}) {
  const isDark = variant === "dark";
  const { language, toggleLanguage } = useContext(LanguageContext);

  // Demo state just to make the UI feel interactive
  const [sendAmt, setSendAmt] = useState(1000);
  const rate = 600; // 1 USD = 600 SDG (demo)
  const theyGet = useMemo(() => {
    const n = Number(String(sendAmt).replace(/[^\d.]/g, "")) || 0;
    return Math.max(0, Math.floor(n * rate)).toLocaleString();
  }, [sendAmt]);

  const fee = 0;
  const transferTime = "Same day";
  const totalToPay = `${Number(String(sendAmt).replace(/[^\d.]/g, "") || 0).toLocaleString()} USD`;

  return (
    <section className={`${styles.hero} ${isDark ? styles.dark : styles.light}`}>
      {/* Top nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <img src={logoSrc} alt="Hawel" className={styles.logo} />
            <span className={styles.brandName}>Hawel</span>
          </div>
          <nav className={styles.links} aria-label="Primary">
            <Link to="/fees">Fees</Link>
            <Link to="/help">Help</Link>
            <Link to="/track-transfer">Track</Link>
            <Link to="/pdpl">PDPL</Link>
            <Link to="/aml-ctf">AML/CTF</Link>
            <button
              type="button"
              className={styles.langButton}
              onClick={toggleLanguage}
              title="Switch language"
            >
              {language === "en" ? "EN | AR" : "AR | EN"}
            </button>
          </nav>
        </div>
      </header>

      {/* Body */}
      <div className={styles.heroInner}>
        <div className={styles.copy}>
          <h1>Send money to Sudan in minutes</h1>
          <p className={styles.sub}>
            Clear rates and fees. GCC residents can onboard online; others via manual review.
          </p>
          <ul className={styles.chips}>
            <li>Transparent fees</li>
            <li>PDPL compliant</li>
            <li>Screened & secure</li>
            <li>24/7 support</li>
          </ul>
        </div>

        {/* Calculator card */}
        <aside className={styles.card} aria-labelledby="calc-title">
          <h2 id="calc-title" className={styles.cardTitle}>
            Estimate your transfer
          </h2>

          {/* You send */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>You send</label>
            <div className={styles.inputShell}>
              <input
                className={styles.input}
                inputMode="decimal"
                value={sendAmt}
                onChange={(e) => setSendAmt(e.target.value)}
                aria-label="Amount you send in USD"
              />
              <CurrencyPill currency="USD" />
            </div>
          </div>

          {/* Rate strip */}
          <div className={styles.rateRow}>
            <RateBadge />
            <div className={styles.rateText}>
              1 USD = <strong>{rate.toLocaleString()}</strong> SDG
            </div>
          </div>

          {/* They get */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>They get</label>
            <div className={styles.inputShell}>
              <input
                className={`${styles.input} ${styles.inputReadOnly}`}
                value={theyGet}
                readOnly
                aria-label="Amount receiver gets in SDG"
              />
              <CurrencyPill currency="SDG" />
            </div>
          </div>

          {/* Receive method */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Receive method</label>
            <div className={styles.selectShell}>
              <select className={styles.select} aria-label="Receive method">
                <option>Cash Pickup</option>
                <option>Bank Transfer</option>
              </select>
              <span className={styles.selectChev} aria-hidden="true">▾</span>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.sRow}>
              <span>Fee</span>
              <span>{fee} USD</span>
            </div>
            <div className={styles.sRow}>
              <span>Transfer time</span>
              <span className={styles.timeGood}>{transferTime}</span>
            </div>
            <div className={styles.sRow}>
              <span>Total to pay</span>
              <span className={styles.total}>{totalToPay}</span>
            </div>
          </div>

          {/* Actions */}
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onMakeTransfer}>
            Send Money
          </button>

          <div className={styles.moreActions}>
            <button className={`${styles.btnSm} ${styles.btnOutline}`} onClick={onTrack}>
              Track a Transfer
            </button>
            <button className={`${styles.btnSm}`} onClick={onRegister}>
              Register
            </button>
            <button className={`${styles.btnSm} ${styles.btnDark}`} onClick={onLogin}>
              Log in
            </button>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        © 2025 HawelMoney · support@hawelmoney.com
      </footer>
    </section>
  );
}
