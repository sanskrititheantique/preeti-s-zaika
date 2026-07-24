import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

// Public: a customer can check their own order status using the order id
// (the id acts like a private tracking code — it isn't listable by anyone else).
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const doc = await db().collection("orders").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await request.json();
    const update = {};

    const allowedStatus = ["received", "preparing", "out_for_delivery", "delivered", "cancelled"];
    const allowedPayment = ["cod", "awaiting_confirmation", "paid"];

    if (body.status !== undefined) {
      if (!allowedStatus.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      update.status = body.status;
    }
    if (body.paymentStatus !== undefined) {
      if (!allowedPayment.includes(body.paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
      }
      update.paymentStatus = body.paymentStatus;
    }

    await db().collection("orders").doc(id).update(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
