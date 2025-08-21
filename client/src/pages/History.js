import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function History() {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransfers = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/transfers/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch transfers");

        const data = await res.json();
        setTransfers(data);
      } catch (err) {
        setError("Error loading transfers.");
      }
    };

    fetchTransfers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <h2 className="text-2xl font-headline mb-4">Your Transfer History</h2>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <div className="w-full max-w-2xl">
        {transfers.length === 0 ? (
          <p className="text-center">No transfers found.</p>
        ) : (
          <div className="space-y-4">
            {transfers.map((t) => (
              <div
                key={t.reference_number}
                className="bg-white p-4 rounded shadow"
              >
                <p><strong>Reference:</strong> {t.reference_number}</p>
                <p><strong>Receiver:</strong> {t.receiver_name}</p>
                <p><strong>Amount:</strong> {t.amount}</p>
                <p><strong>Status:</strong> {t.status}</p>
                <p><strong>Date:</strong> {new Date(t.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
