"use client";

import { useMemo, useState } from "react";
import { UPI_ID, WHATSAPP_NUMBER } from "@/lib/shopConfig";
import OrderStatusStepper from "./OrderStatusStepper";

export default function CartPanel({ open, onClose, items, cart, setCart }) {
  const [step, setStep] = useState("cart"); // cart | checkout | confirmed
  const [form, setForm] = useState({
    customerName: "",
    quarterNumber: "",
    phone: "",
    notes: "",
    paymentMethod: "COD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const lines = useMemo(() => {
    return Object.entries(cart)
      .map(([itemId, qty]) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return null;
        return { item, qty };
      })
      .filter(Boolean);
  }, [cart, items]);

  const total = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);

  function updateQty(itemId, delta) {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[itemId] || 0) + delta;
      if (newQty <= 0) delete next[itemId];
      else next[itemId] = newQty;
      return next;
    });
  }

  function close() {
    onClose();
    if (step === "confirmed") {
      setStep("cart");
      setOrder(null);
      setForm({ customerName: "", quarterNumber: "", phone: "", notes: "", paymentMethod: "COD" });
    }
  }

  async function submitOrder(e) {
    e.preventDefault();
    setError("");
    if (!form.customerName.trim() || !form.quarterNumber.trim()) {
      setError("Please enter your name and quarter number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cart: lines.map((l) => ({ itemId: l.item.id, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setOrder(data);
      setCart({});
      setStep("confirmed");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,33,24,0.55)",
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(430px, 100vw)",
          height: "100%",
          background: "var(--cream)",
          overflowY: "auto",
          padding: 20,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 22 }}>
            {step === "cart" && "Your Cart"}
            {step === "checkout" && "Order Details"}
            {step === "confirmed" && "Order Placed! 🎉"}
          </h2>
          <button onClick={close} className="btn btn-sm btn-outline" aria-label="Close">
            ✕
          </button>
        </div>

        {step === "cart" && (
          <>
            {lines.length === 0 ? (
              <p style={{ color: "var(--ink-soft)" }}>
                Your cart is empty. Add something tasty from the menu!
              </p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {lines.map(({ item, qty }) => (
                    <div
                      key={item.id}
                      className="ticket"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 10,
                      }}
                    >
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{item.name}</div>
                        <div className="price" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                          ₹{item.price} × {qty} = ₹{item.price * qty}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updateQty(item.id, -1)} className="btn btn-sm btn-outline" style={{ padding: "2px 10px" }}>
                          −
                        </button>
                        <span style={{ minWidth: 14, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="btn btn-sm btn-outline" style={{ padding: "2px 10px" }}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 14,
                    borderTop: "2px dashed var(--line)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span className="price">₹{total}</span>
                </div>

                <button
                  onClick={() => setStep("checkout")}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: 16 }}
                >
                  Proceed to Order →
                </button>
              </>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Your Name *">
              <input
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Rohit Sharma"
                style={inputStyle}
              />
            </Field>
            <Field label="Quarter Number *">
              <input
                required
                value={form.quarterNumber}
                onChange={(e) => setForm({ ...form, quarterNumber: e.target.value })}
                placeholder="e.g. Quarter No. 24-B"
                style={inputStyle}
              />
            </Field>
            <Field label="Phone Number (optional)">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="For delivery updates"
                style={inputStyle}
              />
            </Field>
            <Field label="Any instructions? (optional)">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. less spicy"
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>

            <Field label="Payment Method *">
              <div style={{ display: "flex", gap: 10 }}>
                <PayOption
                  label="💵 Cash on Delivery"
                  active={form.paymentMethod === "COD"}
                  onClick={() => setForm({ ...form, paymentMethod: "COD" })}
                />
                <PayOption
                  label="📱 UPI"
                  active={form.paymentMethod === "UPI"}
                  onClick={() => setForm({ ...form, paymentMethod: "UPI" })}
                  disabled={!UPI_ID}
                />
              </div>
              {!UPI_ID && (
                <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
                  UPI not set up yet — Cash on Delivery only.
                </p>
              )}
            </Field>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 17,
                fontWeight: 700,
                padding: "10px 0",
                borderTop: "2px dashed var(--line)",
              }}
            >
              <span>Total</span>
              <span className="price">₹{total}</span>
            </div>

            {error && (
              <p style={{ color: "var(--maroon)", fontSize: 13.5, fontWeight: 600 }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setStep("cart")} className="btn btn-outline" style={{ flex: 1 }}>
                ← Back
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
                {submitting ? "Placing order…" : "Place Order"}
              </button>
            </div>
          </form>
        )}

        {step === "confirmed" && order && (
          <div className="ticket" style={{ padding: 18 }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>Order ID</p>
            <p className="mono" style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, wordBreak: "break-all" }}>
              {order.id}
            </p>

            <OrderStatusStepper status={order.status} />

            <div style={{ marginTop: 16, borderTop: "2px dashed var(--line)", paddingTop: 12 }}>
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

            {order.paymentMethod === "UPI" && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>
                  Scan &amp; pay ₹{order.total} via UPI
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/upi-qr?amount=${order.total}&note=${encodeURIComponent("Order " + order.id.slice(0, 6))}`}
                  alt="UPI QR code"
                  width={180}
                  height={180}
                  style={{ borderRadius: 12, border: "2px solid var(--line)" }}
                />
                <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
                  Paid via UPI to {UPI_ID}. We'll confirm once received.
                </p>
              </div>
            )}

            <p style={{ fontSize: 13, marginTop: 16, color: "var(--ink-soft)" }}>
              Save this link to track your order:{" "}
              <a href={`/order/${order.id}`} style={{ color: "var(--maroon)", fontWeight: 600 }}>
                /order/{order.id.slice(0, 8)}…
              </a>
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <a href={`/order/${order.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>
                Track Order
              </a>
              {WHATSAPP_NUMBER && (
                
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi! I just placed order ${order.id.slice(0, 8)} for ₹${order.total}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

function PayOption({ label, active, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn btn-sm"
      style={{
        flex: 1,
        background: active ? "var(--forest)" : "var(--paper)",
        color: active ? "var(--cream)" : "var(--ink)",
        border: `2px solid ${active ? "var(--forest)" : "var(--line)"}`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}

const inputStyle = {
  border: "2px solid var(--line)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
  background: "var(--paper)",
  color: "var(--ink)",
};
