// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    residencyCountryCode: "BH",
  });
  const [msg, setMsg] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const r = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 202) {
        setMsg("Registered. EDD/manual review required before sending.");
        return;
      }
      if (!r.ok) throw new Error(data.message || "Registration failed");
      setMsg("Registration successful, please log in.");
      setTimeout(() => nav("/login"), 600);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {msg && <div className="mb-3">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Full name"
               name="name" value={form.name} onChange={change} required />
        <input className="w-full border px-3 py-2 rounded" placeholder="Email" type="email"
               name="email" value={form.email} onChange={change} required />
        <input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password"
               name="password" value={form.password} onChange={change} required />
        <label className="block text-sm">Residency Country Code</label>
        <select className="w-full border px-3 py-2 rounded"
                name="residencyCountryCode" value={form.residencyCountryCode} onChange={change}>
          {["BH","SA","AE","KW","OM","QA","IN"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="w-full bg-green-600 text-white font-semibold py-2 rounded">Create account</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link to="/login" className="text-green-700">Log in</Link></p>
    </main>
  );
}
