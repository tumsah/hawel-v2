// client/src/components/HeroCalculator.jsx
import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./hero-calculator.module.css";
import { LanguageContext } from "../LanguageContext";

/** Currency -> country-code mapping for flags */
const CCY = {
  USD: { cc: "us", label: "United States Dollar" },
  SDG: { cc: "sd", label: "Sudanese Pound" },
  BHD: { cc: "bh", label: "Bahraini Dinar" },
  KWD: { cc: "kw", label: "Kuwaiti Dinar" },
  AED: { cc: "ae", label: "UAE Dirham" },
  SAR: { cc: "sa", label: "Saudi Riyal" },
  QAR: { cc: "qa", label: "Qatari Riyal" },
  OMR: { cc: "om", label: "Omani Rial" },
};

const GCC_LIST = ["BHD", "KWD", "AED", "SAR", "QAR", "OMR", "USD"];

function flagSrc(cc) {
  return {
    src: `https://flagcdn.com/24x18/${cc}.png`,
    srcSet: `https://flagcdn.com/48x36/${cc}.png 2x`,
  };
}

/** Small badge with better contrast */
function RateBadge({ text = "First Transfer Rate 🎉" }) {
  return <span className={styles.rateBadge}>{text}</span>;
}

/** Accessible custom currency picker with flags */
function CurrencyPicker({ value, onChange, allowed = GCC_LIST }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // close on outside click / Esc
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const info = CCY[value] || { cc: "xx", label: value };
  const { src, srcSet } = flagSrc(info.cc);

  return (
    <div className={styles.ccyWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.ccyPill}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <img
          className={styles.flagImg}
          src={src}
          srcSet={srcSet}
          width={18}
          height={14}
          alt={`${info.label} flag`}
          loading="lazy"
        />
        <span className={styles.ccyCode}>{value}</span>
        <span className={styles.chev} aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul className={styles.ccyMenu} role="listbox" aria-label="Choose currency">
          {allowed.map((code) => {
            const it = CCY[code];
            const { src: s, srcSet: ss } = flagSrc(it.cc);
            const selected = code === value;
            return (
              <li
                key={code}
                role="option"
                aria-selected={selected}
                className={styles.ccyItem}
                onClick={() => {
                  onChange(code);
                  setOpen(false);
                }}
              >
                <img
                  className={styles.flagImg}
                  src={s}
                  srcSet={ss}
                  width={18}
                  height={14}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <span className={styles.itemCode}>{code}</span>
                <span className={styles.itemLabel}>{it.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
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

  // UI state
  const [sendAmt, setSendAmt] = useState(1000);
  const [sendCcy, setSendCcy] = useState("USD"); // picker
  const [recvCcy] = useState("SDG");              // fixed for now

  // Demo rate: 1 USD = 600 SDG (pretend)
  const rate = 600;

  const cleanNumber = (v) => Number(String(v).replace(/[^\d.]/g, "")) || 0;

  const theyGet = useMemo(() => {
    const n = cleanNumber(sendAmt);
    return Math.max(0, Math.floor(n * rate)).toLocaleString();
  }, [sendAmt]);

  const fee = 0;
  const transferTime = "Same day";
  const totalToPay = `${cleanNumber(sendAmt).toLocaleString()} ${sendCcy}`;

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
                aria-label={`Amount you send in ${sendCcy}`}
              />
              <CurrencyPicker value={sendCcy} onChange={setSendCcy} />
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
                aria-label={`Amount receiver gets in ${recvCcy}`}
              />
              {/* Fixed receiver currency for now */}
              <div className={styles.ccyWrap}>
                <button className={styles.ccyPill} type="button" disabled>
                  <img
                    className={styles.flagImg}
                    {...flagSrc(CCY[recvCcy].cc)}
                    width={18}
                    height={14}
                    alt="Sudan flag"
                  />
                  <span className={styles.ccyCode}>{recvCcy}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Receive method */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Receive method</label>
            <div className={styles.selectShell}>
              <select className={styles.select} aria-label="Receive method">
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash Pickup</option>
              </select>
              <span className={styles.selectChev} aria-hidden="true">▾</span>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.sRow}>
              <span>Fee</span>
              <span>{fee} {sendCcy}</span>
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
            <button className={styles.btnSm} onClick={onRegister}>
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
