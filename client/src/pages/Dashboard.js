// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }

    (async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/transfers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (r.status === 401 || r.status === 403) { nav("/login"); return; }
        const data = await r.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setMsg("Unable to load transfers.");
      }
    })();
  }, [nav]);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/make-transfer" className="px-4 py-2 rounded bg-green-600 text-white">Make a transfer</Link>
          <Link to="/logout" className="px-4 py-2 rounded bg-neutral-800 text-white">Log out</Link>
        </div>
      </div>

      {msg && <div className="mb-3 text-red-600">{msg}</div>}

      <div className="border rounded overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">Reference</th>
              <th className="p-2 border-b">Receiver</th>
              <th className="p-2 border-b">Amount</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="p-2 border-b">{t.reference_number}</td>
                <td className="p-2 border-b">{t.receiver_name}</td>
                <td className="p-2 border-b">{t.amount} {t.currency}</td>
                <td className="p-2 border-b">{t.status}</td>
                <td className="p-2 border-b">{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-3" colSpan={5}>No transfers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

