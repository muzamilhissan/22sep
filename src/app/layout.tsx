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
  title: "Still Celebrating You, Eraj 🎀 | Birthday Week",
  description: "Brand-new little surprises for Eraj's birthday week: a jar of 21 sunshine notes, a bouquet to bloom, a photo booth, and unlimited virtual hugs.",
  openGraph: {
    title: "Still Celebrating You, Eraj 🎀",
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
