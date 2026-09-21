import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FFF5F7"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://eraj-21st-birthday.vercel.app"),
  title: "More Surprises for Eraj 🎀 | Birthday Tea Party",
  description: "Round two of Eraj's birthday surprises: Mochi the teacup kitten, secret-message balloons, a cupcake decorator, fortune cookies, and a coupon book.",
  openGraph: {
    title: "More Surprises for Eraj 🎀",
    description: "The candles are out, but the celebrating isn't over. New surprises inside 💗",
    images: ["/photos/img3.webp"]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
