"use client";

import React, { useState, useEffect, useCallback } from "react";
import FloatingPetals from "@/components/FloatingPetals";
import HeroSection from "@/components/HeroSection";
import BirthdayCake from "@/components/BirthdayCake";
import SurpriseSection from "@/components/SurpriseSection";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import LockScreen from "@/components/LockScreen";
import { getTimeRemaining } from "@/utils/countdown";
import { BIRTHDAY_DATA } from "@/data/birthdayData";

export default function Home() {
  // null until checked on the client, so neither screen flashes before we know the time
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setIsUnlocked(getTimeRemaining(BIRTHDAY_DATA.targetUnlockDate).isUnlocked);
  }, []);

  const handleUnlock = useCallback(() => setIsUnlocked(true), []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main style={{ minHeight: "100svh", position: "relative", overflowX: "clip" }}>
      {/* Floating Cherry Blossom & Rose Petals */}
      <FloatingPetals />

      {isUnlocked === null ? null : !isUnlocked ? (
        /* The September 22 Countdown Lock Screen — opens automatically at midnight PKT */
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        /* The Full Cute Birthday Celebration */
        <>
          <HeroSection onScrollTo={handleScrollTo} />
          <BirthdayCake />
          <SurpriseSection />
          <PhotoGallery />
          <Footer />
          <MusicPlayer />
        </>
      )}
    </main>
  );
}
