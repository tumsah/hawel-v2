// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const r = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Login failed");
      if (!data.token) throw new Error("No token returned");
      localStorage.setItem("token", data.token);
      nav("/dashboard");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      {msg && <div className="mb-3 text-red-600">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Email"
               type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border px-3 py-2 rounded" placeholder="Password"
               type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="w-full bg-green-600 text-white font-semibold py-2 rounded">Sign in</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-green-700">Register</Link></p>
    </main>
  );
}
