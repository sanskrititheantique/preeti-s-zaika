export const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "Preeti's Zaika e Zone";
export const SHOP_TAGLINE = "Ghar jaisa swaad, har bite ke saath!";
export const SHOP_TIMING = process.env.NEXT_PUBLIC_SHOP_TIMING || "11 AM to 9 PM";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "";

export const STATUS_LABELS = {
  received: "Order received",
  preparing: "Preparing your food",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_STEPS = ["received", "preparing", "out_for_delivery", "delivered"];

export const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  awaiting_confirmation: "UPI — waiting for confirmation",
  paid: "UPI — Paid",
};
