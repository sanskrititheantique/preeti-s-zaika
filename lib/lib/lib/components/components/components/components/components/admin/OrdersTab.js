"use client";

import { useEffect, useState, useCallback } from "react";
import { STATUS_STEPS, STATUS_LABELS, PAYMENT_LABELS } from "@/lib/shopConfig";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  async function updateStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function markPaid(id) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid" } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "paid" }),
    });
  }

  const visibleOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return !["delivered", "cancelled"].includes(o.status);
    return o.status === filter;
  });

  if (loading) return <p style={{ color: "var(--ink-soft)" }}>Loading orders…</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          ["active", "Active"],
          ["all", "All"],
          ["delivered", "Delivered"],
          ["cancelled", "Cancelled"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="btn btn-sm"
            style={{
              background: filter === key ? "var(--forest)" : "var(--paper)",
              color: filter === key ? "var(--cream)" : "var(--ink)",
              border: "2px solid var(--line)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No orders here yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visibleOrders.map((order) => (
            <div key={order.id} className="ticket" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{order.customerName}</strong>{" "}
                  <span style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>· Quarter {order.quarterNumber}</span>
                  {order.phone && <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>📞 {order.phone}</div>}
                </div>
                <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ margin: "10px 0", borderTop: "2px dashed var(--line)", paddingTop: 10 }}>
                {order.items.map((l) => (
                  <div key={l.itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span>{l.name} × {l.qty}</span>
                    <span className="price">₹{l.price * l.qty}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 6 }}>
                  <span>Total</span>
                  <span className="price">₹{order.total}</span>
                </div>
              </div>

              {order.notes && (
                <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--ink-soft)" }}>
                  Note: {order.notes}
                </p>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
                <span
                  className={`badge ${order.paymentMethod === "COD" ? "badge-gray" : order.paymentStatus === "paid" ? "badge-green" : "badge-mustard"}`}
                >
                  {order.paymentMethod === "COD" ? "💵" : "📱"} {PAYMENT_LABELS[order.paymentStatus] || order.paymentMethod}
                </span>
                {order.paymentMethod === "UPI" && order.paymentStatus !== "paid" && (
                  <button onClick={() => markPaid(order.id)} className="btn btn-sm btn-outline">
                    Mark as Paid
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {STATUS_STEPS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    className="btn btn-sm"
                    style={{
                      background: order.status === s ? "var(--mustard)" : "var(--paper)",
                      border: "2px solid var(--line)",
                      color: "var(--ink)",
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                <button
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className="btn btn-sm"
                  style={{
                    background: order.status === "cancelled" ? "var(--maroon)" : "var(--paper)",
                    color: order.status === "cancelled" ? "var(--cream)" : "var(--maroon)",
                    border: "2px solid var(--maroon)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
