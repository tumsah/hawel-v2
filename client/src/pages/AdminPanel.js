import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function AdminPanel() {
  const { language } = useContext(LanguageContext);

  const handleExport = () => {
    const token = localStorage.getItem("token");
    window.open(
      `${API_BASE_URL}/api/transfers/export?token=${token}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-headline mb-4 text-center">
          {language === "en" ? "Admin Panel" : "لوحة التحكم"}
        </h2>
        <Link
          to="/admin/transfers"
          className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-center"
        >
          {language === "en" ? "View Transfers" : "عرض التحويلات"}
        </Link>
        <Link
          to="/admin/tickets"
          className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-center"
        >
          {language === "en" ? "View Support Tickets" : "عرض التذاكر"}
        </Link>
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {language === "en" ? "Download Transaction CSV" : "تنزيل معاملات CSV"}
        </button>
      </div>
    </div>
  );
}
