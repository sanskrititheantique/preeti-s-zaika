"use client";

import { useEffect, useState, useCallback } from "react";

const emptyForm = { name: "", description: "", price: "", unit: "", category: "", image: "" };

export default function MenuTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/items?all=1");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function loadStarterMenu() {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSeedMsg(data.added > 0 ? `Added ${data.added} item(s)!` : "Starter items are already loaded.");
      load();
    } catch (err) {
      setSeedMsg(err.message);
    } finally {
      setSeeding(false);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    setError("");
    if (!newItem.name.trim() || newItem.price === "") {
      setError("Name and price are required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewItem(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    await fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item permanently?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/items/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      {items.length === 0 && !loading && (
        <div className="ticket" style={{ padding: 16, marginBottom: 18, textAlign: "center" }}>
          <p style={{ marginBottom: 10, fontSize: 14 }}>
            No menu items yet. Load the 5 starter items from your posters with one click:
          </p>
          <button onClick={loadStarterMenu} disabled={seeding} className="btn btn-primary">
            {seeding ? "Loading…" : "🍽️ Load Starter Menu"}
          </button>
          {seedMsg && <p style={{ marginTop: 8, fontSize: 13, color: "var(--forest)" }}>{seedMsg}</p>}
        </div>
      )}

      <div className="ticket" style={{ padding: 16, marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, marginBottom: 10 }}>Add New Item</h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
          Tip: for the photo, use a path like <code>/images/your-photo.jpg</code> (upload the file
          into the <code>public/images</code> folder in GitHub) or paste any image link from the web.
        </p>
        <form onSubmit={addItem} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <input placeholder="Item name *" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
          <input placeholder="Price (₹) *" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} style={inputStyle} />
          <input placeholder="Unit (plate / piece / combo)" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} style={inputStyle} />
          <input placeholder="Category (e.g. Combos, Chaat)" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} style={inputStyle} />
          <input placeholder="Image path or URL" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} style={inputStyle} />
          <input placeholder="Short description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <button type="submit" disabled={adding} className="btn btn-primary" style={{ gridColumn: "1 / -1" }}>
            {adding ? "Adding…" : "+ Add Item"}
          </button>
        </form>
        {error && <p style={{ color: "var(--maroon)", marginTop: 8, fontSize: 13.5 }}>{error}</p>}
      </div>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Loading menu…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <EditableItemRow key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function EditableItemRow({ item, onUpdate, onDelete }) {
  const [local, setLocal] = useState(item);
  const [dirty, setDirty] = useState(false);

  function change(field, value) {
    setLocal((l) => ({ ...l, [field]: value }));
    setDirty(true);
  }

  function save() {
    onUpdate(item.id, {
      name: local.name,
      description: local.description,
      price: Number(local.price),
      unit: local.unit,
      category: local.category,
      image: local.image,
    });
    setDirty(false);
  }

  return (
    <div
      className="ticket"
      style={{
        padding: 14,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        opacity: item.available === false ? 0.55 : 1,
      }}
    >
      {local.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={local.image} alt={local.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
        <input value={local.name} onChange={(e) => change("name", e.target.value)} style={inputStyleSm} />
        <input type="number" value={local.price} onChange={(e) => change("price", e.target.value)} style={inputStyleSm} />
        <input value={local.unit || ""} onChange={(e) => change("unit", e.target.value)} placeholder="unit" style={inputStyleSm} />
        <input value={local.category || ""} onChange={(e) => change("category", e.target.value)} placeholder="category" style={inputStyleSm} />
        <input value={local.image || ""} onChange={(e) => change("image", e.target.value)} placeholder="image path/url" style={{ ...inputStyleSm, gridColumn: "1 / -1" }} />
        <input value={local.description || ""} onChange={(e) => change("description", e.target.value)} placeholder="description" style={{ ...inputStyleSm, gridColumn: "1 / -1" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
        {dirty && (
          <button onClick={save} className="btn btn-sm btn-primary">
            Save
          </button>
        )}
        <button
          onClick={() => onUpdate(item.id, { available: item.available === false })}
          className="btn btn-sm btn-outline"
        >
          {item.available === false ? "Unpause" : "Pause"}
        </button>
        <button onClick={() => onDelete(item.id)} className="btn btn-sm" style={{ background: "var(--maroon)", color: "var(--cream)" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  border: "2px solid var(--line)",
  borderRadius: 10,
  padding: "9px 11px",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "var(--paper)",
};

const inputStyleSm = { ...inputStyle, padding: "7px 9px", fontSize: 13 };
