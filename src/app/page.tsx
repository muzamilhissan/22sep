"use client";

import React from "react";
import FloatingPetals from "@/components/FloatingPetals";
import KittenHero from "@/components/KittenHero";
import InfiniteBirthday from "@/components/InfiniteBirthday";
import BalloonPop from "@/components/BalloonPop";
import CupcakeDecorator from "@/components/CupcakeDecorator";
import FortuneCookie from "@/components/FortuneCookie";
import CouponBook from "@/components/CouponBook";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { useIsClient } from "@/utils/useIsClient";

export default function Home() {
  // The coupon book reads saved progress from the browser, so render the sections client-side only
  const isClient = useIsClient();

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ minHeight: "100svh", position: "relative", overflowX: "clip" }}>
      {/* Floating Cherry Blossom & Rose Petals */}
      <FloatingPetals />

      {isClient && (
        <>
          <KittenHero onScrollTo={handleScrollTo} />
          <InfiniteBirthday />
          <BalloonPop />
          <CupcakeDecorator />
          <FortuneCookie />
          <CouponBook />
          <Footer />
          <MusicPlayer />
        </>
      )}
    </main>
  );
}
