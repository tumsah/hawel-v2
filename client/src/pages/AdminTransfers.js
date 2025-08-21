import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function AdminTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTransfers = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/transfers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load transfers");
        const data = await res.json();
        setTransfers(data);
      } catch (err) {
        setError("Error fetching transfers.");
      }
    };

    fetchTransfers();
  }, []);

  const markComplete = async (id) => {
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/transfers/${id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error marking complete");

      setMessage("Transfer marked as completed.");
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "completed" } : t
        )
      );
    } catch (err) {
      setError("Error updating transfer.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <h2 className="text-2xl font-headline mb-4">All Transfers</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {message && <div className="mb-4 text-green-700">{message}</div>}

      <div className="w-full max-w-3xl space-y-4">
        {transfers.length === 0 ? (
          <p className="text-center">No transfers found.</p>
        ) : (
          transfers.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded shadow">
              <p><strong>User:</strong> {t.user_email}</p>
              <p><strong>Reference:</strong> {t.reference_number}</p>
              <p><strong>Amount:</strong> {t.amount}</p>
              <p><strong>Status:</strong> {t.status}</p>
              <p><strong>Date:</strong> {new Date(t.created_at).toLocaleDateString()}</p>
              {t.status !== "completed" && (
                <button
                  onClick={() => markComplete(t.id)}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
