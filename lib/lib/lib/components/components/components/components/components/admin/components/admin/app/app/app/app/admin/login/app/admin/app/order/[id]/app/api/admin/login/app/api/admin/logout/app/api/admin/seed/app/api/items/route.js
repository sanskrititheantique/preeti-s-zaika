import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const wantAll = url.searchParams.get("all") === "1";
    const admin = isAdminRequest(request);

    const snap = await db().collection("items").orderBy("sortOrder", "asc").get();
    let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (!(wantAll && admin)) {
      items = items.filter((it) => it.available !== false);
    }

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, description = "", price, unit = "", category = "Other", image = "" } = body;

    if (!name || price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json(
        { error: "Item name and a valid price are required." },
        { status: 400 }
      );
    }

    const col = db().collection("items");
    const countSnap = await col.get();

    const docRef = await col.add({
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      unit: String(unit).trim(),
      category: String(category).trim(),
      image: String(image).trim(),
      available: true,
      sortOrder: countSnap.size,
      createdAt: Date.now(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
