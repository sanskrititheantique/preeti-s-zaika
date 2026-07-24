"use client";

import { SHOP_NAME, SHOP_TAGLINE, SHOP_TIMING, WHATSAPP_NUMBER } from "@/lib/shopConfig";

export default function Header({ cartCount, onCartClick }) {
  return (
    <header
      style={{
        background: "var(--forest)",
        color: "var(--cream)",
        borderBottom: "6px solid var(--mustard)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ color: "var(--cream)", fontSize: "clamp(22px, 4vw, 32px)" }}>
            {SHOP_NAME}
          </h1>
          <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: 14 }}>{SHOP_TAGLINE}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge badge-mustard">⏰ {SHOP_TIMING}</span>
          {WHATSAPP_NUMBER && (
            
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm"
              style={{ background: "#25D366", color: "#04240f" }}
            >
              WhatsApp Order
            </a>
          )}
          <button
            onClick={onCartClick}
            className="btn btn-sm btn-primary"
            aria-label="Open cart"
          >
            🛒 Cart{cartCount > 0 ? ` · ${cartCount}` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
