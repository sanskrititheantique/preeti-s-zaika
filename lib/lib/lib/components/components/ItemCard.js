"use client";

export default function ItemCard({ item, qtyInCart, onAdd, onRemove }) {
  return (
    <div
      className="ticket"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--line)",
              color: "var(--ink-soft)",
            }}
          >
            No photo
          </div>
        )}
        {item.category && (
          <span
            className="badge badge-green"
            style={{ position: "absolute", top: 10, left: 10, background: "var(--paper)" }}
          >
            {item.category}
          </span>
        )}
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: 19 }}>{item.name}</h3>
        {item.description && (
          <p style={{ color: "var(--ink-soft)", fontSize: 13.5, margin: "6px 0 0", lineHeight: 1.4 }}>
            {item.description}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="price" style={{ fontSize: 20, fontWeight: 600, color: "var(--maroon)" }}>
            ₹{item.price}
            {item.unit && (
              <span style={{ fontSize: 12, color: "var(--ink-soft)", fontFamily: "Poppins" }}>
                {" "}
                /{item.unit}
              </span>
            )}
          </span>

          {qtyInCart > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--forest)",
                borderRadius: 999,
                padding: "4px 6px",
              }}
            >
              <button
                onClick={onRemove}
                aria-label="Decrease quantity"
                className="btn btn-sm"
                style={{ background: "transparent", color: "var(--cream)", padding: "2px 8px" }}
              >
                −
              </button>
              <span style={{ color: "var(--cream)", fontWeight: 600, minWidth: 14, textAlign: "center" }}>
                {qtyInCart}
              </span>
              <button
                onClick={onAdd}
                aria-label="Increase quantity"
                className="btn btn-sm"
                style={{ background: "transparent", color: "var(--cream)", padding: "2px 8px" }}
              >
                +
              </button>
            </div>
          ) : (
            <button onClick={onAdd} className="btn btn-sm btn-primary">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
