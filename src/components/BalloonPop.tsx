"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { PartyPopper, RotateCcw } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const WORDS = BIRTHDAY_DATA.balloonMessage;
const COLORS = [
  ["#FFB3C6", "#FF7096"],
  ["#FFE1EB", "#FFB3C6"],
  ["#FCE8B3", "#F3C969"],
  ["#E5D4FF", "#C5A3FF"],
  ["#FFD6E0", "#FF8FA3"],
  ["#FF9EBB", "#EE4E7B"]
];

export default function BalloonPop() {
  const [popped, setPopped] = useState<boolean[]>(() => WORDS.map(() => false));
  const [round, setRound] = useState(0);

  const poppedCount = popped.filter(Boolean).length;
  const allPopped = poppedCount === WORDS.length;

  const pop = (i: number, el: HTMLElement) => {
    if (popped[i]) return;
    sounds.playBalloonPop();
    const next = popped.map((p, j) => p || j === i);
    setPopped(next);

    const r = el.getBoundingClientRect();
    confetti({
      particleCount: 24,
      spread: 360,
      startVelocity: 18,
      gravity: 0.8,
      scalar: 0.8,
      ticks: 90,
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
      colors: [COLORS[i % COLORS.length][1], "#FFFFFF", "#F3C969"]
    });

    if (next.every(Boolean)) {
      setTimeout(() => {
        sounds.playSparkle();
        confetti({ particleCount: 110, spread: 90, origin: { y: 0.6 }, colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969", "#FFFFFF"] });
      }, 250);
    }
  };

  const reset = () => {
    sounds.playPluck(4);
    setPopped(WORDS.map(() => false));
    setRound((r) => r + 1);
  };

  return (
    <section id="balloon-section" className="section-wrap">
      <div
        className="glass-panel"
        style={{ width: "100%", maxWidth: "760px", padding: "50px 30px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <SectionHeader
          icon={<PartyPopper size={14} />}
          badge="Pop the Balloons"
          title="Something's Hiding in Here 🎈"
          subtitle="Every balloon is holding a secret word. Pop them all to read the message!"
        />

        {/* Balloons (tucked away once the whole message is revealed) */}
        <div
          key={round}
          style={{
            display: allPopped ? "none" : "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px 8px",
            width: "100%",
            maxWidth: "420px",
            marginBottom: "26px"
          }}
        >
          {WORDS.map((word, i) => {
            const [light, dark] = COLORS[i % COLORS.length];
            return (
              <div key={i} style={{ height: "150px", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "relative" }}>
                {popped[i] ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "34px", animation: "popIn 0.4s ease both" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)", fontWeight: 700 }}>#{i + 1}</span>
                    <span className="font-script" style={{ fontSize: "clamp(1.4rem, 5.5vw, 1.8rem)", color: dark, lineHeight: 1.1 }}>
                      {word}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={`Pop balloon ${i + 1}`}
                    onClick={(e) => pop(i, e.currentTarget)}
                    className="pressable"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      animation: `balloonBob ${2.6 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite`
                    }}
                  >
                    {/* Balloon body */}
                    <div
                      style={{
                        position: "relative",
                        width: "70px",
                        height: "86px",
                        borderRadius: "50% 50% 48% 48% / 55% 55% 45% 45%",
                        background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${light} 22%, ${dark} 100%)`,
                        boxShadow: `inset -6px -8px 0 rgba(0,0,0,0.06), 0 8px 18px ${dark}55`
                      }}
                    >
                      <div style={{ position: "absolute", top: "14px", left: "14px", width: "12px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.7)", transform: "rotate(25deg)" }} />
                      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", opacity: 0.85 }}>?</span>
                    </div>
                    {/* Knot */}
                    <div style={{ width: "12px", height: "8px", background: dark, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", marginTop: "-1px" }} />
                    {/* String */}
                    <svg width="20" height="44" viewBox="0 0 20 44" aria-hidden="true">
                      <path d="M10 0 C 2 10, 18 20, 10 30 S 6 40, 10 44" stroke="#C9A0AC" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* The message being assembled */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "6px 10px",
            padding: "14px 18px",
            background: "#FFFBF7",
            border: "1.5px dashed var(--color-pink-300)",
            borderRadius: "16px",
            maxWidth: "440px",
            width: "100%",
            marginBottom: "16px"
          }}
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="font-handwriting"
              style={{
                fontSize: "clamp(1.4rem, 5.5vw, 1.7rem)",
                color: popped[i] ? "var(--color-pink-600)" : "var(--color-pink-200)",
                minWidth: popped[i] ? undefined : "40px",
                borderBottom: popped[i] ? "none" : "2px solid var(--color-pink-200)",
                lineHeight: 1.2,
                transition: "color 0.3s ease"
              }}
            >
              {popped[i] ? word : " "}
            </span>
          ))}
        </div>

        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: allPopped ? "var(--color-pink-600)" : "var(--color-text-light)", marginBottom: allPopped ? "16px" : 0 }}>
          {allPopped ? "Message unlocked! 💌" : `${poppedCount} / ${WORDS.length} popped`}
        </p>

        {allPopped && (
          <button type="button" className="btn-cute-secondary" onClick={reset}>
            <RotateCcw size={16} />
            <span>Blow up new balloons</span>
          </button>
        )}
      </div>
    </section>
  );
}
