// src/pages/MakeTransfer.js
import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../LanguageContext";
import { API_BASE_URL } from "../config";

export default function MakeTransfer() {
  const { language } = useContext(LanguageContext);

  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    senderAddress: "",
    senderPhone: "",
    receiverName: "",
    receiverContact: "",
    currency: "AED",
    amount: "",
    residencyCountryCode: "BH",
  });

  const [exchangeRates, setExchangeRates] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/exchange-rates`);
        if (!res.ok) throw new Error("Failed to load rates");
        const data = await res.json();
        const rates = {};
        data.forEach((r) => { rates[r.currency] = r.rate; });
        setExchangeRates(rates);
      } catch (err) {
        console.error(err);
        setError(language === "en" ? "Error loading exchange rates." : "حدث خطأ في تحميل أسعار الصرف.");
      }
    };
    fetchRates();
  }, [language]);

  const usdToSdg = 600;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCalculate = () => {
    setError(""); setResult(null); setSuccess("");
    const numericAmount = parseFloat(form.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(language === "en" ? "Enter a valid amount." : "أدخل مبلغًا صالحًا."); return;
    }
    const rate = exchangeRates[form.currency];
    if (!rate) { setError(language === "en" ? "Currency rate not available." : "سعر العملة غير متاح."); return; }
    const usdAmount = numericAmount * rate;
    if (usdAmount > 5000) {
      setError(language === "en" ? "Transfers over $5000 are not allowed." : "التحويلات التي تزيد عن 5000 دولار غير مسموح بها.");
      return;
    }
    const fee = usdAmount <= 1000 ? usdAmount * 0.025 : 25;
    const exchangeFee = usdAmount * 0.025;
    const totalUsd = usdAmount + fee + exchangeFee;
    const totalSdg = totalUsd * usdToSdg;
    setResult({ usdAmount, fee, exchangeFee, totalUsd, totalSdg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!result) {
      setError(language === "en" ? "Please calculate before submitting." : "يرجى حساب المبلغ قبل الإرسال."); return;
    }
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { setError(language === "en" ? "Please log in first." : "يرجى تسجيل الدخول أولاً."); return; }

      const transferRes = await fetch(`${API_BASE_URL}/api/transfers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sender_name: form.senderName, sender_email: form.senderEmail, sender_address: form.senderAddress,
          sender_phone: form.senderPhone, receiver_name: form.receiverName, receiver_contact: form.receiverContact,
          currency: form.currency, amount: parseFloat(form.amount),
          usd_amount: result.usdAmount, total_usd: result.totalUsd, total_sdg: result.totalSdg,
          residencyCountryCode: form.residencyCountryCode,
        }),
      });

      if (!transferRes.ok) {
        const data = await transferRes.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create transfer");
      }
      const transferData = await transferRes.json();

      const paymentRes = await fetch(`${API_BASE_URL}/api/payments/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: result.totalUsd }),
      });

      if (paymentRes.status === 501) {
        setSuccess(
          language === "en"
            ? `Transfer created. Payments are disabled in this demo. Reference: ${transferData.reference_number}`
            : `تم إنشاء التحويل. الدفع معطّل في هذا العرض التجريبي. رقم المرجع: ${transferData.reference_number}`
        );
        return;
      }

      if (!paymentRes.ok) {
        const data = await paymentRes.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create checkout session");
      }

      const { checkout_url } = await paymentRes.json();
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        setSuccess(
          language === "en"
            ? `Transfer created. (No checkout URL). Reference: ${transferData.reference_number}`
            : `تم إنشاء التحويل (بدون رابط دفع). رقم المرجع: ${transferData.reference_number}`
        );
      }
    } catch (err) {
      console.error(err);
      setError(language === "en" ? err.message || "Error submitting transfer." : "حدث خطأ أثناء إرسال التحويل.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <h2 className="text-2xl font-headline mb-4">
        {language === "en" ? "Make a Transfer" : "إجراء تحويل"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-700 font-semibold">{success}</div>}

        {[
          { name: "senderName", labelEn: "Sender Full Name", labelAr: "الاسم الكامل للمرسل" },
          { name: "senderEmail", labelEn: "Sender Email", labelAr: "بريد المرسل", type: "email" },
          { name: "senderAddress", labelEn: "Sender Address", labelAr: "عنوان المرسل" },
          { name: "senderPhone", labelEn: "Sender Phone Number", labelAr: "هاتف المرسل" },
          { name: "receiverName", labelEn: "Receiver Full Name", labelAr: "اسم المستلم" },
          { name: "receiverContact", labelEn: "Receiver Phone or Email", labelAr: "هاتف أو بريد المستلم" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1">{language === "en" ? field.labelEn : field.labelAr}</label>
            <input
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1">{language === "en" ? "Residency Country Code (GCC)" : "رمز الدولة (الخليج)"}</label>
          <select
            name="residencyCountryCode"
            value={form.residencyCountryCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {["BH", "SA", "AE", "KW", "OM", "QA", "IN"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">{language === "en" ? "Currency" : "العملة"}</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {Object.keys(exchangeRates).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">{language === "en" ? "Amount" : "المبلغ"}</label>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          {language === "en" ? "Calculate" : "احسب"}
        </button>

        {result && (
          <div className="mt-4 bg-green-50 p-4 rounded space-y-2">
            <p>{language === "en" ? `USD Equivalent: $${result.usdAmount.toFixed(2)}` : `ما يعادل بالدولار: $${result.usdAmount.toFixed(2)}`}</p>
            <p>{language === "en" ? `Exchange Fee: $${result.exchangeFee.toFixed(2)}` : `رسوم الصرف: $${result.exchangeFee.toFixed(2)}`}</p>
            <p>{language === "en" ? `Transfer Fee: $${result.fee.toFixed(2)}` : `رسوم التحويل: $${result.fee.toFixed(2)}`}</p>
            <p>{language === "en" ? `Total USD: $${result.totalUsd.toFixed(2)}` : `الإجمالي بالدولار: $${result.totalUsd.toFixed(2)}`}</p>
            <p>{language === "en" ? `Total in SDG: ${result.totalSdg.toFixed(2)} SDG` : `الإجمالي بالجنيه: ${result.totalSdg.toFixed(2)} جنيه`}</p>
          </div>
        )}

        <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded">
          {language === "en" ? "Submit Transfer" : "إرسال التحويل"}
        </button>
      </form>
    </div>
  );
}
