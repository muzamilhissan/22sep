"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sun, RotateCcw } from "lucide-react";
import { BIRTHDAY_DATA, JarNote } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const STORAGE_KEY = "eraj-jar-opened";
const NOTES = BIRTHDAY_DATA.jarNotes;
const STAR_COLORS = ["#FF9EBB", "#FFC2D4", "#FF7096", "#FCE8B3", "#F3C969", "#FFB3C6", "#FFD6E0"];

// Notes come out in a fixed shuffled order; #21 is always saved for last
const PULL_ORDER = [...Array.from({ length: 20 }, (_, k) => ((k * 7) % 20) + 1), 21];

// Stars are packed from the bottom of the jar in rows of 5,4,5,4,3
const STAR_SLOTS = (() => {
  const rows = [5, 4, 5, 4, 3];
  const slots: { x: number; y: number; rot: number; color: string }[] = [];
  rows.forEach((count, row) => {
    const offset = (5 - count) * 19;
    for (let k = 0; k < count; k++) {
      const i = slots.length;
      slots.push({
        x: 14 + offset + k * 38,
        y: 10 + row * 31,
        rot: (i * 47) % 72,
        color: STAR_COLORS[i % STAR_COLORS.length]
      });
    }
  });
  return slots;
})();

function Star({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function loadOpened(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export default function WishJar() {
  // This section only mounts on the client, so reading storage here is safe
  const [opened, setOpened] = useState<number[]>(loadOpened);
  const [current, setCurrent] = useState<JarNote | null>(null);
  const [wiggleKey, setWiggleKey] = useState(0);
  const [launchKey, setLaunchKey] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(opened));
    } catch {
      // storage unavailable (private mode) — progress just won't persist
    }
  }, [opened]);

  const remaining = NOTES.length - opened.length;
  const isEmpty = remaining === 0;

  const pullStar = () => {
    if (isPulling) return;
    if (isEmpty) {
      sounds.playJiggle();
      setWiggleKey((k) => k + 1);
      return;
    }
    const nextId = PULL_ORDER.find((id) => !opened.includes(id));
    const note = NOTES.find((n) => n.id === nextId);
    if (!note) return;

    setIsPulling(true);
    sounds.playJiggle();
    setWiggleKey((k) => k + 1);
    setLaunchKey((k) => k + 1);
    setCurrent(null);

    setTimeout(() => {
      sounds.playChime();
      const next = [...opened, note.id];
      setOpened(next);
      setCurrent(note);
      setIsPulling(false);
      if (next.length === NOTES.length) {
        setTimeout(() => {
          sounds.playSparkle();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969", "#FFFFFF"]
          });
        }, 350);
      }
    }, 520);
  };

  const refill = () => {
    sounds.playSparkle();
    setOpened([]);
    setCurrent(null);
  };

  const visibleStars = STAR_SLOTS.slice(0, remaining);
  const currentIndex = current ? opened.indexOf(current.id) + 1 : 0;

  return (
    <section id="jar-section" className="section-wrap">
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
          icon={<Sun size={14} />}
          badge="Jar of Little Sunshines"
          title="21 Folded Stars, Just for You ⭐"
          subtitle="Every paper star in this jar hides a tiny note. Tap the jar to pull one out; open one a day, or all of them at once. No rules. 💛"
        />

        {/* The jar */}
        <div style={{ position: "relative", width: "220px", height: "300px", marginBottom: "12px" }}>
          {/* Star flying out */}
          {launchKey > 0 && isPulling && (
            <div
              key={launchKey}
              style={{
                position: "absolute",
                top: "60px",
                left: "50%",
                zIndex: 10,
                animation: "starLaunch 0.6s ease-out forwards",
                pointerEvents: "none"
              }}
            >
              <Star color="#F3C969" size={40} />
            </div>
          )}

          <div
            role="button"
            tabIndex={0}
            aria-label={isEmpty ? "The jar is empty" : `Pull a star from the jar (${remaining} left)`}
            className="pressable"
            onClick={pullStar}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pullStar();
              }
            }}
            style={{ position: "absolute", inset: 0 }}
          >
            <div
              key={wiggleKey}
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "bottom center",
                animation: wiggleKey ? "jarWiggle 0.5s ease-in-out" : undefined
              }}
            >
              {/* Gingham lid */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "40px",
                  width: "140px",
                  height: "30px",
                  borderRadius: "10px 10px 6px 6px",
                  background:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 8px, transparent 8px 16px), repeating-linear-gradient(0deg, rgba(255,255,255,0.55) 0 8px, transparent 8px 16px), #FF9EBB",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 4px 10px rgba(238, 78, 123, 0.2)",
                  zIndex: 3
                }}
              />
              <span style={{ position: "absolute", top: "0px", left: "50%", transform: "translateX(-50%)", fontSize: "1.9rem", zIndex: 4 }}>
                🎀
              </span>

              {/* Neck */}
              <div
                style={{
                  position: "absolute",
                  top: "42px",
                  left: "52px",
                  width: "116px",
                  height: "22px",
                  background: "rgba(255, 255, 255, 0.55)",
                  border: "3px solid rgba(255, 255, 255, 0.95)",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  zIndex: 2
                }}
              />

              {/* Glass body */}
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "10px",
                  width: "200px",
                  height: "232px",
                  borderRadius: "46px 46px 54px 54px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,240,244,0.35) 50%, rgba(255,225,235,0.5) 100%)",
                  border: "3px solid rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 18px 40px rgba(238, 78, 123, 0.22), inset 0 0 30px rgba(255, 194, 212, 0.45)",
                  overflow: "hidden"
                }}
              >
                {visibleStars.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${s.x}px`,
                      bottom: `${s.y}px`,
                      transform: `rotate(${s.rot}deg)`,
                      transition: "opacity 0.3s ease"
                    }}
                  >
                    <Star color={s.color} size={34} />
                  </div>
                ))}

                {isEmpty && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.6rem"
                    }}
                  >
                    💖
                  </div>
                )}

                {/* Glass shine */}
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "18px",
                    width: "18px",
                    height: "150px",
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))"
                  }}
                />
              </div>

              {/* Hanging tag */}
              <div
                className="font-handwriting"
                style={{
                  position: "absolute",
                  top: "150px",
                  right: "-18px",
                  background: "#FFFBF7",
                  border: "1.5px solid #FFC2D4",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "1.15rem",
                  color: "var(--color-pink-600)",
                  transform: "rotate(8deg)",
                  boxShadow: "0 4px 10px rgba(238, 78, 123, 0.15)",
                  zIndex: 5,
                  lineHeight: 1.1
                }}
              >
                for Eraj ♡
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-pink-600)", marginBottom: "20px" }}>
          {isEmpty ? "All 21 stars unfolded 🥹" : `${remaining} star${remaining === 1 ? "" : "s"} left in the jar · tap to pull one`}
        </p>

        {/* The unfolded note */}
        {current && (
          <div
            key={current.id}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "440px",
              background:
                "repeating-linear-gradient(180deg, transparent 0 31px, rgba(255, 158, 187, 0.25) 31px 32px), #FFFBF7",
              border: "1.5px solid #FFCCD5",
              borderRadius: "14px",
              padding: "34px 24px 22px",
              boxShadow: "0 14px 34px rgba(238, 78, 123, 0.18)",
              animation: "noteUnfold 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both",
              transformOrigin: "top center",
              marginBottom: "22px"
            }}
          >
            <div className="washi-tape" />
            <div style={{ fontSize: "2.2rem", marginBottom: "6px" }}>{current.emoji}</div>
            <p
              className="font-handwriting"
              style={{ fontSize: "clamp(1.35rem, 5.4vw, 1.6rem)", color: "var(--color-text-main)", lineHeight: 1.3 }}
            >
              {current.text}
            </p>
            <p style={{ marginTop: "12px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-pink-400)" }}>
              STAR {currentIndex} OF 21
            </p>
          </div>
        )}

        {isEmpty && (
          <p
            className="font-script"
            style={{ fontSize: "clamp(1.4rem, 6vw, 1.8rem)", color: "var(--color-pink-600)", marginBottom: "18px" }}
          >
            The jar is empty, but the love isn&apos;t. 💗
          </p>
        )}

        {/* Collection of opened stars — tap to reread */}
        {opened.length > 0 && (
          <div style={{ width: "100%", maxWidth: "460px" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", fontWeight: 600, marginBottom: "8px" }}>
              Your unfolded stars · tap to read again
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
              {opened.map((id, i) => {
                const note = NOTES.find((n) => n.id === id);
                if (!note) return null;
                const isActive = current?.id === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={`Read star ${i + 1} again`}
                    onClick={() => {
                      sounds.playPluck(i);
                      setCurrent(note);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isActive ? "var(--color-pink-100)" : "transparent",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                      transition: "background 0.2s ease"
                    }}
                  >
                    {note.emoji}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isEmpty && (
          <button type="button" className="btn-cute-secondary" onClick={refill} style={{ marginTop: "18px" }}>
            <RotateCcw size={16} />
            <span>Refill the jar</span>
          </button>
        )}
      </div>
    </section>
  );
}
