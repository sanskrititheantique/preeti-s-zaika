"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import { PAYMENT_LABELS, SHOP_NAME } from "@/lib/shopConfig";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found.");
        if (active) setOrder(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    }
    load();
    const interval = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  return (
    <main className="container" style={{ padding: "40px 20px", maxWidth: 520 }}>
      <a href="/" style={{ color: "var(--forest)", fontWeight: 600, fontSize: 14 }}>
        ← Back to {SHOP_NAME}
      </a>
      <h1 style={{ fontSize: 26, margin: "14px 0 20px" }}>Track Your Order</h1>

      {error && <p style={{ color: "var(--maroon)" }}>{error}</p>}

      {!order && !error && <p style={{ color: "var(--ink-soft)" }}>Loading order…</p>}

      {order && (
        <div className="ticket" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>Order ID</p>
          <p className="mono" style={{ fontWeight: 700, marginBottom: 16, wordBreak: "break-all" }}>{order.id}</p>

          <OrderStatusStepper status={order.status} />

          <div style={{ marginTop: 20, borderTop: "2px dashed var(--line)", paddingTop: 14 }}>
            {order.items.map((l) => (
              <div key={l.itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                <span>{l.name} × {l.qty}</span>
                <span className="price">₹{l.price * l.qty}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 8 }}>
              <span>Total</span>
              <span className="price">₹{order.total}</span>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
            <span>👤 {order.customerName} · 🏠 Quarter {order.quarterNumber}</span>
            <span>💳 {PAYMENT_LABELS[order.paymentStatus] || order.paymentMethod}</span>
          </div>
        </div>
      )}
    </main>
  );
}
