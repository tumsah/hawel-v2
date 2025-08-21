// src/pages/TrackTransfer.js
import React, { useState, useContext } from "react";
import { LanguageContext } from "../LanguageContext";
import { API_BASE_URL } from "../config";

export default function TrackTransfer() {
  const { language } = useContext(LanguageContext);
  const [ref, setRef] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/transfers/status/${encodeURIComponent(ref)}`);
      if (!res.ok) throw new Error("Transfer not found");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(language === "en" ? "Unable to find transfer." : "غير قادر على العثور على التحويل.");
    }
  };

  const statusMap = {
    pending: language === "en" ? "Pending" : "قيد الانتظار",
    completed: language === "en" ? "Completed" : "مكتمل",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <h2 className="text-2xl font-headline mb-4">
        {language === "en" ? "Track Your Transfer" : "تتبع التحويل"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
          placeholder={language === "en" ? "Reference Number" : "رقم المرجع"}
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
          required
        />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {language === "en" ? "Check Status" : "تحقق من الحالة"}
        </button>
      </form>

      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-sm w-full space-y-2">
          <p><strong>{language === "en" ? "Status:" : "الحالة:"}</strong> {statusMap[result.status] || result.status}</p>
          <p><strong>{language === "en" ? "Receiver:" : "المستلم:"}</strong> {result.receiver_name}</p>
          <p><strong>{language === "en" ? "Amount:" : "المبلغ:"}</strong> {result.amount}</p>
          <p><strong>{language === "en" ? "Date:" : "التاريخ:"}</strong> {new Date(result.createdAt).toLocaleDateString()}</p>
          {result.proof_image && (
            <p>
              <a href={`${API_BASE_URL}/uploads/${result.proof_image}`} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                {language === "en" ? "View Proof of Payment" : "عرض إثبات الدفع"}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
