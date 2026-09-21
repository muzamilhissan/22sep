"use client";

import React from "react";
import FloatingPetals from "@/components/FloatingPetals";
import BunnyHero from "@/components/BunnyHero";
import WishJar from "@/components/WishJar";
import BouquetBuilder from "@/components/BouquetBuilder";
import PhotoBooth from "@/components/PhotoBooth";
import HugButton from "@/components/HugButton";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { useIsClient } from "@/utils/useIsClient";

export default function Home() {
  // The jar and hug counter read saved progress from the browser, so render the sections client-side only
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
          <BunnyHero onScrollTo={handleScrollTo} />
          <WishJar />
          <BouquetBuilder />
          <PhotoBooth />
          <HugButton />
          <Footer />
          <MusicPlayer />
        </>
      )}
    </main>
  );
}
