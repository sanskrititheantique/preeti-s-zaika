"use client";

import { STATUS_STEPS, STATUS_LABELS } from "@/lib/shopConfig";

export default function OrderStatusStepper({ status }) {
  if (status === "cancelled") {
    return (
      <div className="badge badge-maroon" style={{ fontSize: 14, padding: "8px 16px" }}>
        ✕ This order was cancelled
      </div>
    );
  }

  const activeIndex = Math.max(0, STATUS_STEPS.indexOf(status));
  const progressPct = (activeIndex / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div style={{ padding: "6px 4px 0" }}>
      <div style={{ position: "relative", height: 30, marginBottom: 8 }}>
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 0,
            right: 0,
            height: 3,
            backgroundImage:
              "linear-gradient(to right, var(--line) 50%, transparent 0%)",
            backgroundSize: "10px 3px",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 0,
            width: `${progressPct}%`,
            height: 3,
            background: "var(--mustard)",
            transition: "width 0.4s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -2,
            left: `calc(${progressPct}% - 14px)`,
            fontSize: 22,
            transition: "left 0.4s ease",
          }}
          aria-hidden
        >
          🛵
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {STATUS_STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              flex: 1,
              textAlign: i === 0 ? "left" : i === STATUS_STEPS.length - 1 ? "right" : "center",
              fontSize: 11.5,
              fontWeight: i <= activeIndex ? 700 : 500,
              color: i <= activeIndex ? "var(--forest)" : "var(--ink-soft)",
            }}
          >
            {STATUS_LABELS[step]}
          </div>
        ))}
      </div>
    </div>
  );
}
