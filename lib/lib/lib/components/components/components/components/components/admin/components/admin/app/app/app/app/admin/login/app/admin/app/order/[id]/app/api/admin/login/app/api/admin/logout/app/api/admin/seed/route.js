import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

const STARTER_ITEMS = [
  {
    name: "Soya Chaap Masala Combo",
    description: "Soft, juicy soya chaap in rich masala gravy — dhaba style. Comes with 4 roti, salad & green chatney.",
    price: 80,
    unit: "combo",
    category: "Combos",
    image: "/images/soya_chaap_combo.jpg",
  },
  {
    name: "Aloo Sabzi with Masala Puri",
    description: "Bhandare-style aloo ki sabzi with 5 pieces of hot masala puri.",
    price: 50,
    unit: "combo",
    category: "Combos",
    image: "/images/aloo_sabzi_puri.jpg",
  },
  {
    name: "Dahi Bhalle",
    description: "Soft, spongy bhalle with dahi, meethi chutney, hari chutney & masale.",
    price: 50,
    unit: "plate",
    category: "Chaat",
    image: "/images/dahi_bhalle.jpg",
  },
  {
    name: "Bhelpuri",
    description: "Crispy, spicy, tangy puffed rice with sev, peanut, sabziya & special chutney.",
    price: 50,
    unit: "plate",
    category: "Chaat",
    image: "/images/bhelpuri.jpg",
  },
  {
    name: "Aloo Bread Pakoda",
    description: "Crispy, garma-garam pakoda with masaledar aloo stuffing.",
    price: 20,
    unit: "piece",
    category: "Snacks",
    image: "/images/aloo_bread_pakoda.jpg",
  },
];

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  try {
    const col = db().collection("items");
    const existingSnap = await col.get();
    const existingNames = new Set(existingSnap.docs.map((d) => d.data().name));
    let sortOrder = existingSnap.size;
    let added = 0;

    for (const item of STARTER_ITEMS) {
      if (existingNames.has(item.name)) continue;
      await col.add({ ...item, available: true, sortOrder: sortOrder++, createdAt: Date.now() });
      added++;
    }

    return NextResponse.json({ ok: true, added });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
