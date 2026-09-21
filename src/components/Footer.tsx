"use client";

import React from "react";
import { Heart, ArrowUp } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

export default function Footer() {
  const scrollToTop = () => {
    sounds.playPop(800);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 180, 205, 0.4)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255, 235, 240, 0.9) 100%)",
        padding: "40px 20px calc(90px + env(safe-area-inset-bottom)) 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        position: "relative",
        zIndex: 10
      }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="animate-pulse-slow"
        style={{
          cursor: "pointer",
          padding: 0,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "1.5px solid #FFAFCC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EE4E7B",
          boxShadow: "0 4px 12px rgba(238, 78, 123, 0.15)"
        }}
        title="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      <p
        className="font-playfair"
        style={{
          fontSize: "clamp(1.1rem, 4.5vw, 1.3rem)",
          color: "var(--color-pink-700)",
          fontWeight: 600
        }}
      >
        Still celebrating you, Eraj! 🎀
      </p>

      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "4px 6px"
        }}
      >
        <span>Made with infinite love, for her birthday week</span>
        <Heart size={14} fill="#EE4E7B" color="#EE4E7B" />
        <span>22 September</span>
      </p>
    </footer>
  );
}
