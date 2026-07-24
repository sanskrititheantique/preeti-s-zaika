"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import CartPanel from "@/components/CartPanel";
import { SHOP_NAME } from "@/lib/shopConfig";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = {};
    for (const it of items) {
      const cat = it.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    }
    return map;
  }, [items]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = items.reduce((sum, it) => sum + (cart[it.id] || 0) * it.price, 0);

  function addOne(id) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }
  function removeOne(id) {
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[id] || 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <section
        style={{
          background: "var(--forest)",
          color: "var(--cream)",
          padding: "10px 0 26px",
          borderBottom: "4px solid var(--mustard)",
        }}
      >
        <div className="container">
          <span className="badge badge-mustard" style={{ marginBottom: 10 }}>
            🍽️ Today's Menu
          </span>
          <h2 style={{ color: "var(--cream)", fontSize: "clamp(24px, 5vw, 36px)", marginTop: 8 }}>
            Fresh, home-style food — ordered in a tap
          </h2>
          <p style={{ opacity: 0.85, marginTop: 6, maxWidth: 520 }}>
            Tell us your name and quarter number, choose Cash on Delivery or UPI, and your order
            is on its way!
          </p>
        </div>
      </section>

      <main className="container" style={{ padding: "28px 20px 100px" }}>
        {loading ? (
          <p style={{ color: "var(--ink-soft)" }}>Loading menu…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>
            No items yet — the shop owner can add today's menu from the{" "}
            <a href="/admin" style={{ color: "var(--maroon)", fontWeight: 600 }}>
              admin panel
            </a>
            .
          </p>
        ) : (
          Object.entries(categories).map(([cat, catItems]) => (
            <div key={cat} style={{ marginBottom: 34 }}>
              <h3 style={{ fontSize: 22, marginBottom: 14, borderLeft: "5px solid var(--mustard)", paddingLeft: 10 }}>
                {cat}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 18,
                }}
              >
                {catItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    qtyInCart={cart[item.id] || 0}
                    onAdd={() => addOne(item.id)}
                    onRemove={() => removeOne(item.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="btn btn-primary"
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
            boxShadow: "var(--shadow)",
            padding: "14px 28px",
          }}
        >
          🛒 View Cart · {cartCount} item{cartCount > 1 ? "s" : ""} · ₹{cartTotal}
        </button>
      )}

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        cart={cart}
        setCart={setCart}
      />

      <footer style={{ textAlign: "center", padding: "20px 0 40px", color: "var(--ink-soft)", fontSize: 13 }}>
        © {new Date().getFullYear()} {SHOP_NAME} · Made with ❤️
      </footer>
    </>
  );
}
