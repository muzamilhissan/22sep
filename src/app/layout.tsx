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
  title: "Happy 21st Birthday Eraj! 🌸🎂 | 22 September",
  description: "A cute, floral, and magical 21st birthday celebration for Eraj with an interactive cake, cherished memories polaroid wall, and heartfelt surprises.",
  openGraph: {
    title: "Happy 21st Birthday Eraj! 🌸🎂",
    description: "Celebrating 21 years of grace, sunshine, and pure magic. Happy Birthday Eraj!",
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
