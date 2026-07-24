import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export async function PUT(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await request.json();
    const update = {};

    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.description !== undefined) update.description = String(body.description).trim();
    if (body.price !== undefined) {
      if (isNaN(Number(body.price))) {
        return NextResponse.json({ error: "Price must be a number." }, { status: 400 });
      }
      update.price = Number(body.price);
    }
    if (body.unit !== undefined) update.unit = String(body.unit).trim();
    if (body.category !== undefined) update.category = String(body.category).trim();
    if (body.image !== undefined) update.image = String(body.image).trim();
    if (body.available !== undefined) update.available = Boolean(body.available);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder);

    await db().collection("items").doc(id).update(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const { id } = params;
    await db().collection("items").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
