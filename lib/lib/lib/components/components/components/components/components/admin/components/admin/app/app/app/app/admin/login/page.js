"use client";

import { useState } from "react";
import { SHOP_NAME } from "@/lib/shopConfig";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form onSubmit={submit} className="ticket" style={{ padding: 28, width: "min(380px, 100%)" }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Admin Login</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 18 }}>
          {SHOP_NAME} — Menu &amp; Orders Panel
        </p>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>
          Username
          <input
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              border: "2px solid var(--line)",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              background: "var(--paper)",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, fontWeight: 600 }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: "2px solid var(--line)",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              background: "var(--paper)",
            }}
          />
        </label>

        {error && <p style={{ color: "var(--maroon)", fontSize: 13.5, marginTop: 10 }}>{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: 18 }}>
          {loading ? "Checking…" : "Log In"}
        </button>
      </form>
    </main>
  );
}
