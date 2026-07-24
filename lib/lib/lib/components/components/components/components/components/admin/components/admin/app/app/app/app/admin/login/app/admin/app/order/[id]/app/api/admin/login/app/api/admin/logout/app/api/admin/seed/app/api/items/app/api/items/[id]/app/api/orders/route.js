import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const snap = await db().collection("orders").orderBy("createdAt", "desc").limit(200).get();
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      quarterNumber,
      phone = "",
      notes = "",
      paymentMethod,
      cart, // [{ itemId, qty }]
    } = body;

    if (!customerName || !String(customerName).trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!quarterNumber || !String(quarterNumber).trim()) {
      return NextResponse.json({ error: "Quarter number is required." }, { status: 400 });
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!["COD", "UPI"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Choose a valid payment method." }, { status: 400 });
    }

    // Re-fetch real item data server-side so prices can't be tampered with from the browser
    const itemsCol = db().collection("items");
    const orderItems = [];
    let total = 0;

    for (const line of cart) {
      const qty = Math.max(1, Number(line.qty) || 1);
      const doc = await itemsCol.doc(line.itemId).get();
      if (!doc.exists) continue;
      const data = doc.data();
      if (data.available === false) {
        return NextResponse.json(
          { error: `"${data.name}" is currently unavailable. Please remove it from your cart.` },
          { status: 400 }
        );
      }
      const lineTotal = data.price * qty;
      total += lineTotal;
      orderItems.push({
        itemId: doc.id,
        name: data.name,
        price: data.price,
        unit: data.unit || "",
        qty,
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
    }

    const orderData = {
      customerName: String(customerName).trim(),
      quarterNumber: String(quarterNumber).trim(),
      phone: String(phone).trim(),
      notes: String(notes).trim(),
      items: orderItems,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "cod" : "awaiting_confirmation",
      status: "received",
      createdAt: Date.now(),
    };

    const docRef = await db().collection("orders").add(orderData);
    return NextResponse.json({ id: docRef.id, ...orderData });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
