import "./globals.css";

export const metadata = {
  title: "Preeti's Zaika e Zone — Ghar jaisa swaad, har bite ke saath!",
  description:
    "Order fresh, home-style food online from Preeti's Zaika e Zone. Soya Chaap Masala, Dahi Bhalle, Bhelpuri, Aloo Sabzi Puri and more — cash on delivery or UPI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Poppins:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
