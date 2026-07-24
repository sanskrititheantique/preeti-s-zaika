import QRCode from "qrcode";

export async function GET(request) {
  const url = new URL(request.url);
  const amount = url.searchParams.get("amount") || "0";
  const note = url.searchParams.get("note") || "Order";

  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName = process.env.NEXT_PUBLIC_UPI_NAME || "Shop";

  if (!upiId) {
    return new Response("UPI ID not configured", { status: 500 });
  }

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;

  const buffer = await QRCode.toBuffer(upiLink, {
    type: "png",
    width: 320,
    margin: 1,
  });

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
