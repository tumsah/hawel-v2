import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setError("Error fetching tickets.");
      }
    };

    fetchTickets();
  }, []);

  const updateStatus = async (id, status) => {
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/tickets/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Error updating status");

      setMessage("Ticket status updated.");
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status } : t
        )
      );
    } catch (err) {
      setError("Error updating ticket.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <h2 className="text-2xl font-headline mb-4">Support Tickets</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {message && <div className="mb-4 text-green-700">{message}</div>}

      <div className="w-full max-w-3xl space-y-4">
        {tickets.length === 0 ? (
          <p className="text-center">No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded shadow"
            >
              <p><strong>User:</strong> {ticket.user_email}</p>
              <p><strong>Subject:</strong> {ticket.subject}</p>
              <p><strong>Message:</strong> {ticket.message}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <div className="mt-2 flex gap-2">
                {["open", "in progress", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(ticket.id, status)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-2 py-1 rounded"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
