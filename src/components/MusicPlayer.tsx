"use client";

import React, { useState } from "react";
import { Music, VolumeX, Sparkles } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

export default function MusicPlayer() {
  // Mounted client-side only, so the sound engine's state can seed this directly
  const [isPlaying, setIsPlaying] = useState(() => sounds.isPlaying());
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    sounds.playPop(700);
    const active = sounds.toggleMusic();
    setIsPlaying(active);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-bottom))",
        right: "calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-right))",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className="music-tooltip"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 180, 205, 0.6)",
          padding: "6px 14px",
          borderRadius: "999px",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--color-pink-600)",
          boxShadow: "0 4px 15px rgba(238, 78, 123, 0.15)",
          opacity: isHovered || isPlaying ? 1 : 0,
          transform: isHovered || isPlaying ? "translateX(0)" : "translateX(10px)",
          pointerEvents: "none",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap"
        }}
      >
        <Sparkles size={14} color="#EE4E7B" />
        {isPlaying ? "Lullaby Music Box Playing 🎵" : "Play the Music Box 🌸"}
      </div>

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? "Mute Music Box" : "Play Music Box"}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: isPlaying
            ? "linear-gradient(135deg, #FF7096, #EE4E7B)"
            : "linear-gradient(135deg, #FFFFFF, #FFE4ED)",
          border: "2px solid #FFAFCC",
          boxShadow: isPlaying
            ? "0 0 20px rgba(238, 78, 123, 0.5), 0 8px 18px rgba(238, 78, 123, 0.3)"
            : "0 4px 15px rgba(238, 78, 123, 0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isPlaying ? "#FFFFFF" : "#EE4E7B",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isPlaying ? "scale(1.05)" : "scale(1)"
        }}
      >
        {isPlaying ? (
          <div style={{ animation: "rotateSlow 6s linear infinite", display: "flex" }}>
            <Music size={22} />
          </div>
        ) : (
          <VolumeX size={20} />
        )}
      </button>
    </div>
  );
}
