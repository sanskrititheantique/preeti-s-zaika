"use client";

import { useEffect, useState } from "react";
import OrdersTab from "@/components/admin/OrdersTab";
import MenuTab from "@/components/admin/MenuTab";
import { SHOP_NAME } from "@/lib/shopConfig";

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
        } else {
          setAuthed(true);
        }
      })
      .finally(() => setAuthChecked(true));
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!authChecked) return null;
  if (!authed) return null;

  return (
    <main className="container" style={{ padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Admin Panel</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>{SHOP_NAME}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/" className="btn btn-sm btn-outline">
            View Site
          </a>
          <button onClick={logout} className="btn btn-sm" style={{ background: "var(--maroon)", color: "var(--cream)" }}>
            Log Out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        <button
          onClick={() => setTab("orders")}
          className="btn"
          style={{
            background: tab === "orders" ? "var(--forest)" : "var(--paper)",
            color: tab === "orders" ? "var(--cream)" : "var(--ink)",
            border: "2px solid var(--line)",
          }}
        >
          📦 Orders
        </button>
        <button
          onClick={() => setTab("menu")}
          className="btn"
          style={{
            background: tab === "menu" ? "var(--forest)" : "var(--paper)",
            color: tab === "menu" ? "var(--cream)" : "var(--ink)",
            border: "2px solid var(--line)",
          }}
        >
          🍽️ Menu Items
        </button>
      </div>

      {tab === "orders" ? <OrdersTab /> : <MenuTab />}
    </main>
  );
}
