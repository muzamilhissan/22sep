"use client";

import React from "react";
import { Sparkles, Heart, Gift, Cake, Camera, ChevronDown } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  const handleActionClick = (targetId: string) => {
    sounds.playPop(620);
    onScrollTo(targetId);
  };

  return (
    <section
      style={{
        minHeight: "90svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(36px, 8vw, 60px) 16px 40px 16px",
        position: "relative"
      }}
    >
      {/* Whimsical Badge */}
      <div
        className="animate-float"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.85)",
          border: "1.5px solid var(--color-pink-300)",
          padding: "8px clamp(12px, 4vw, 20px)",
          borderRadius: "999px",
          boxShadow: "var(--shadow-subtle)",
          marginBottom: "24px",
          maxWidth: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          lineHeight: 1.3,
          fontSize: "clamp(0.78rem, 3.4vw, 0.95rem)",
          fontWeight: 600,
          color: "var(--color-pink-600)"
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>🌸</span>
        <span>Born 22 September • Level 21 Unlocked</span>
        <Sparkles size={16} color="#EE4E7B" />
      </div>

      {/* Main Heading */}
      <h1
        className="font-playfair"
        style={{
          fontSize: "clamp(2.3rem, 9vw, 5.5rem)",
          fontWeight: 700,
          color: "var(--color-pink-700)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: "900px",
          marginBottom: "16px",
          textShadow: "0 4px 20px rgba(255, 112, 150, 0.25)"
        }}
      >
        Happy 21st Birthday, <br />
        <span
          className="font-script"
          style={{
            fontSize: "clamp(3.2rem, 13vw, 6.8rem)",
            background: "linear-gradient(135deg, #FF7096 20%, #D8265B 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            transform: "rotate(-2deg)",
            padding: "0 10px"
          }}
        >
          {BIRTHDAY_DATA.name}
        </span>{" "}
        <span className="animate-pulse-slow" style={{ display: "inline-block" }}>
          💖
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "clamp(1.02rem, 2.5vw, 1.4rem)",
          color: "var(--color-text-muted)",
          maxWidth: "680px",
          marginBottom: "36px",
          lineHeight: 1.6,
          fontWeight: 400
        }}
      >
        {BIRTHDAY_DATA.tagline}
      </p>

      {/* Interactive Quick Action Buttons */}
      <div
        className="hero-actions"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "48px"
        }}
      >
        <button
          onClick={() => handleActionClick("cake-section")}
          className="btn-cute-primary"
          id="hero-blow-candles-btn"
        >
          <Cake size={18} />
          <span>Blow 21 Candles</span>
        </button>

        <button
          onClick={() => handleActionClick("surprise-section")}
          className="btn-cute-secondary"
          id="hero-surprise-btn"
        >
          <Gift size={18} />
          <span>Open Surprise Box</span>
        </button>

        <button
          onClick={() => handleActionClick("gallery-section")}
          className="btn-cute-secondary"
          id="hero-gallery-btn"
        >
          <Camera size={18} />
          <span>Photo Wall</span>
        </button>
      </div>

      {/* Milestone Pill Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          maxWidth: "750px"
        }}
      >
        {[
          { label: "Turning 21 Years Sweet", icon: "🎂" },
          { label: "Born on 22 September", icon: "📅" },
          { label: "Radiant & Cherished", icon: "✨" },
          { label: "Endless Dreams Ahead", icon: "🌸" }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(255, 180, 205, 0.4)",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "clamp(0.8rem, 3.2vw, 0.88rem)",
              fontWeight: 500,
              color: "var(--color-text-main)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(255, 112, 150, 0.08)"
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Gentle Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => handleActionClick("cake-section")}
        style={{
          marginTop: "48px",
          padding: "8px 12px",
          background: "transparent",
          border: "none",
          fontFamily: "inherit",
          cursor: "pointer",
          color: "var(--color-pink-400)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.85rem",
          fontWeight: 600,
          animation: "gentleFloat 3s infinite ease-in-out"
        }}
      >
        <span>Scroll for Birthday Celebrations</span>
        <ChevronDown size={20} />
      </button>
    </section>
  );
}
