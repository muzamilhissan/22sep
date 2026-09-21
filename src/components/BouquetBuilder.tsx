"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Flower2, RotateCcw } from "lucide-react";
import { BIRTHDAY_DATA, BouquetFlower } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const MAX_FLOWERS = 9;
const FLOWERS = BIRTHDAY_DATA.bouquetFlowers;

// Fan-shaped slots above the wrap; filled from the middle outwards so any size bouquet looks balanced
const FILL_ORDER = [4, 3, 5, 2, 6, 1, 7, 0, 8];
const SLOTS = Array.from({ length: MAX_FLOWERS }, (_, s) => {
  const angle = ((-48 + s * 12) * Math.PI) / 180;
  const radius = 118;
  return {
    dx: Math.round(Math.sin(angle) * radius),
    top: Math.round(62 + (1 - Math.cos(angle)) * radius + (s % 2 === 0 ? 0 : 22)),
    rot: Math.round(-48 + s * 12) / 2
  };
});

export default function BouquetBuilder() {
  const [picked, setPicked] = useState<BouquetFlower[]>([]);
  const [lastPicked, setLastPicked] = useState<BouquetFlower | null>(null);

  const isDone = picked.length >= MAX_FLOWERS;

  const addFlower = (flower: BouquetFlower) => {
    if (isDone) return;
    const next = [...picked, flower];
    setPicked(next);
    setLastPicked(flower);
    sounds.playPluck(next.length - 1);

    if (next.length === MAX_FLOWERS) {
      setTimeout(() => {
        sounds.playSparkle();
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.55 },
          colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969", "#B8E6B8"]
        });
      }, 300);
    }
  };

  const reset = () => {
    sounds.playPop(500);
    setPicked([]);
    setLastPicked(null);
  };

  return (
    <section id="bouquet-section" className="section-wrap">
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "760px",
          padding: "50px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <SectionHeader
          icon={<Flower2 size={14} />}
          badge="Bloom a Bouquet"
          title="Pick Your Own Birthday Flowers 💐"
          subtitle={`Tap the flowers below to arrange a bouquet. Every flower means something. Pick ${MAX_FLOWERS} and it gets wrapped with a bow.`}
        />

        {/* Bouquet stage */}
        <div style={{ position: "relative", width: "300px", maxWidth: "100%", height: "290px", marginBottom: "8px" }}>
          {/* Leaves behind the flowers */}
          {picked.length > 0 && (
            <>
              <span style={{ position: "absolute", top: "84px", left: "calc(50% - 104px)", fontSize: "2.6rem", transform: "rotate(-40deg)" }}>🌿</span>
              <span style={{ position: "absolute", top: "84px", left: "calc(50% + 58px)", fontSize: "2.6rem", transform: "scaleX(-1) rotate(-40deg)" }}>🌿</span>
            </>
          )}

          {picked.map((flower, i) => {
            const slot = SLOTS[FILL_ORDER[i]];
            return (
              <span
                key={i}
                aria-hidden="true"
                style={
                  {
                    position: "absolute",
                    top: `${slot.top}px`,
                    left: `calc(50% + ${slot.dx}px)`,
                    fontSize: "3rem",
                    lineHeight: 1,
                    "--rot": `${slot.rot}deg`,
                    transform: `translate(-50%, 0) rotate(${slot.rot}deg)`,
                    animation: "flowerPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                    filter: "drop-shadow(0 4px 6px rgba(238, 78, 123, 0.2))",
                    zIndex: 2
                  } as React.CSSProperties
                }
              >
                {flower.emoji}
              </span>
            );
          })}

          {picked.length === 0 && (
            <div
              className="font-handwriting"
              style={{
                position: "absolute",
                top: "80px",
                left: 0,
                right: 0,
                fontSize: "1.4rem",
                color: "var(--color-text-light)"
              }}
            >
              your bouquet starts here… 🌱
            </div>
          )}

          {/* Paper wrap */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "150px",
              background: "linear-gradient(160deg, #FFE1EB 0%, #FFB3C6 55%, #FF9EBB 100%)",
              clipPath: "polygon(0 0, 100% 0, 62% 100%, 38% 100%)",
              filter: "drop-shadow(0 10px 16px rgba(238, 78, 123, 0.25))",
              zIndex: 3
            }}
          >
            {/* Paper fold highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: "2px",
                height: "100%",
                background: "rgba(255, 255, 255, 0.6)"
              }}
            />
          </div>
          <span
            style={{
              position: "absolute",
              bottom: "38px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "2.6rem",
              zIndex: 4,
              transition: "transform 0.3s ease",
              opacity: isDone ? 1 : 0.35
            }}
          >
            🎀
          </span>
        </div>

        {/* Meaning of the last flower / final tag */}
        <div style={{ minHeight: "56px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
          {isDone ? (
            <div
              className="font-handwriting"
              style={{
                background: "#FFFBF7",
                border: "1.5px solid #FFC2D4",
                borderRadius: "10px",
                padding: "8px 18px",
                fontSize: "clamp(1.3rem, 5vw, 1.5rem)",
                color: "var(--color-pink-600)",
                boxShadow: "0 6px 16px rgba(238, 78, 123, 0.15)",
                animation: "popIn 0.4s ease both",
                transform: "rotate(-1.5deg)"
              }}
            >
              A bouquet that never wilts, for Eraj 💗
            </div>
          ) : lastPicked ? (
            <p key={picked.length} style={{ fontSize: "0.98rem", color: "var(--color-text-main)", animation: "popIn 0.3s ease both" }}>
              <strong style={{ color: "var(--color-pink-600)" }}>
                {lastPicked.emoji} {lastPicked.name}
              </strong>{" "}
              {lastPicked.meaning}
            </p>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>Tap a flower to add it ↓</p>
          )}
        </div>

        {/* Flower picker */}
        {!isDone && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "10px",
              width: "100%",
              maxWidth: "420px",
              marginBottom: "14px"
            }}
          >
            {FLOWERS.map((flower) => (
              <button
                key={flower.id}
                type="button"
                onClick={() => addFlower(flower)}
                aria-label={`Add a ${flower.name}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  padding: "10px 4px",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1.5px solid var(--color-pink-200)",
                  borderRadius: "18px",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-subtle)",
                  fontFamily: "inherit",
                  transition: "transform 0.15s ease"
                }}
                className="btn-flower"
              >
                <span style={{ fontSize: "2rem", lineHeight: 1.1 }}>{flower.emoji}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{flower.name}</span>
              </button>
            ))}
          </div>
        )}

        <p style={{ fontSize: "0.82rem", color: "var(--color-text-light)", fontWeight: 600, marginBottom: picked.length ? "14px" : 0 }}>
          {picked.length} / {MAX_FLOWERS} flowers
        </p>

        {picked.length > 0 && (
          <button type="button" className="btn-cute-secondary" onClick={reset}>
            <RotateCcw size={16} />
            <span>{isDone ? "Make another bouquet" : "Start over"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
