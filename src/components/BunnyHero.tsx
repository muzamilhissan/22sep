"use client";

import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";

interface BunnyHeroProps {
  onScrollTo: (id: string) => void;
}

interface FloatingHeart {
  id: number;
  emoji: string;
  left: number;
  drift: number;
  spin: number;
}

const HEART_EMOJIS = ["💗", "💖", "🩷", "💕", "✨", "🌸"];

const NAV_ITEMS = [
  { id: "jar-section", emoji: "🫙", label: "Sunshine Jar" },
  { id: "bouquet-section", emoji: "💐", label: "Bouquet" },
  { id: "booth-section", emoji: "📸", label: "Photo Booth" },
  { id: "hug-section", emoji: "🤗", label: "Send a Hug" }
];

export default function BunnyHero({ onScrollTo }: BunnyHeroProps) {
  const [boops, setBoops] = useState(0);
  const [hopKey, setHopKey] = useState(0);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const nextHeartId = useRef(0);

  const line = boops === 0 ? "hi Eraj! tap me 🥺" : BIRTHDAY_DATA.bunnyLines[(boops - 1) % BIRTHDAY_DATA.bunnyLines.length];

  const handleBoop = () => {
    const n = boops + 1;
    setBoops(n);
    setHopKey((k) => k + 1);
    if (n % 2 === 0) sounds.playBoop();
    else sounds.playSqueak();

    // Burst of little hearts; spread is derived from the id so it varies without randomness in render
    const burst: FloatingHeart[] = Array.from({ length: 5 }, () => {
      const id = nextHeartId.current++;
      return {
        id,
        emoji: HEART_EMOJIS[id % HEART_EMOJIS.length],
        left: 20 + ((id * 37) % 60),
        drift: ((id * 53) % 90) - 45,
        spin: ((id * 71) % 60) - 30
      };
    });
    setHearts((prev) => [...prev.slice(-20), ...burst]);
    const ids = new Set(burst.map((h) => h.id));
    setTimeout(() => setHearts((prev) => prev.filter((h) => !ids.has(h.id))), 1300);
  };

  return (
    <section
      style={{
        minHeight: "92svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(40px, 8vw, 64px) 16px 36px",
        position: "relative"
      }}
    >
      <div className="section-badge animate-float" style={{ fontSize: "clamp(0.78rem, 3.4vw, 0.9rem)" }}>
        <span>🎀</span>
        <span>Birthday Week Edition</span>
        <span>🎀</span>
      </div>

      <h1
        className="font-playfair"
        style={{
          fontSize: "clamp(2.1rem, 8.5vw, 4.4rem)",
          fontWeight: 700,
          color: "var(--color-pink-700)",
          lineHeight: 1.15,
          marginBottom: "12px",
          textShadow: "0 4px 20px rgba(255, 112, 150, 0.25)"
        }}
      >
        Still celebrating you,
        <br />
        <span
          className="font-script"
          style={{
            fontSize: "clamp(3rem, 13vw, 6rem)",
            background: "linear-gradient(135deg, #FF7096 20%, #D8265B 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            transform: "rotate(-2deg)",
            padding: "0 10px"
          }}
        >
          {BIRTHDAY_DATA.name}
        </span>
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 3.8vw, 1.25rem)",
          color: "var(--color-text-muted)",
          maxWidth: "560px",
          marginBottom: "18px",
          lineHeight: 1.6
        }}
      >
        {BIRTHDAY_DATA.tagline}
      </p>

      {/* Bunny + speech bubble */}
      <div style={{ position: "relative", width: "220px", height: "270px", marginTop: "44px", marginBottom: "8px" }}>
        <div
          key={`bubble-${boops}`}
          style={{
            position: "absolute",
            top: "-44px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FFFFFF",
            border: "2px solid var(--color-pink-200)",
            borderRadius: "18px",
            padding: "7px 14px",
            fontSize: "0.92rem",
            fontWeight: 600,
            color: "var(--color-pink-600)",
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-subtle)",
            animation: "bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            zIndex: 5
          }}
        >
          {line}
          <span
            style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              width: "14px",
              height: "14px",
              background: "#FFFFFF",
              borderRight: "2px solid var(--color-pink-200)",
              borderBottom: "2px solid var(--color-pink-200)",
              transform: "translateX(-50%) rotate(45deg)"
            }}
          />
        </div>

        {hearts.map((h) => (
          <span
            key={h.id}
            aria-hidden="true"
            style={
              {
                position: "absolute",
                top: "70px",
                left: `${h.left}%`,
                fontSize: "1.5rem",
                pointerEvents: "none",
                animation: "floatUpFade 1.2s ease-out forwards",
                zIndex: 6,
                "--drift": `${h.drift}px`,
                "--spin": `${h.spin}deg`
              } as React.CSSProperties
            }
          >
            {h.emoji}
          </span>
        ))}

        <div
          role="button"
          tabIndex={0}
          aria-label="Boop the bunny"
          className="pressable"
          onClick={handleBoop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBoop();
            }
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <div
            key={hopKey}
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "bottom center",
              animation: hopKey ? "bunnyHop 0.6s ease-out" : "gentleFloat 4s ease-in-out infinite"
            }}
          >
            {/* Ears */}
            {[
              { left: "58px", rot: "-12deg" },
              { left: "118px", rot: "12deg" }
            ].map((ear, i) => (
              <div
                key={i}
                style={
                  {
                    position: "absolute",
                    top: "8px",
                    left: ear.left,
                    width: "44px",
                    height: "112px",
                    background: "#FFFFFF",
                    borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
                    boxShadow: "inset -3px -4px 0 rgba(255, 194, 212, 0.5), 0 6px 14px rgba(238, 78, 123, 0.12)",
                    transformOrigin: "bottom center",
                    "--ear-rot": ear.rot,
                    transform: `rotate(${ear.rot})`,
                    animation: `earWiggle ${2.6 + i * 0.4}s ease-in-out infinite`
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "11px",
                    width: "22px",
                    height: "78px",
                    borderRadius: "50%",
                    background: "linear-gradient(180deg, #FFC2D4, #FF9EBB)"
                  }}
                />
              </div>
            ))}

            {/* Bow on the right ear */}
            <span style={{ position: "absolute", top: "20px", left: "146px", fontSize: "2rem", transform: "rotate(18deg)", zIndex: 3 }}>
              🎀
            </span>

            {/* Head */}
            <div
              style={{
                position: "absolute",
                top: "96px",
                left: "20px",
                width: "180px",
                height: "142px",
                background: "radial-gradient(circle at 40% 35%, #FFFFFF 60%, #FFF0F4 100%)",
                borderRadius: "50% 50% 46% 46% / 55% 55% 45% 45%",
                boxShadow: "0 14px 30px rgba(238, 78, 123, 0.18), inset 0 -8px 0 rgba(255, 194, 212, 0.35)",
                zIndex: 2
              }}
            >
              {/* Eyes */}
              {[52, 114].map((left, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "56px",
                    left: `${left}px`,
                    width: "15px",
                    height: "19px",
                    borderRadius: "50%",
                    background: "#4A2E35",
                    transformOrigin: "center",
                    animation: "blink 4.5s infinite"
                  }}
                >
                  <div style={{ position: "absolute", top: "3px", left: "3px", width: "6px", height: "6px", borderRadius: "50%", background: "#FFF" }} />
                </div>
              ))}

              {/* Cheeks */}
              {[26, 128].map((left, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "80px",
                    left: `${left}px`,
                    width: "28px",
                    height: "15px",
                    borderRadius: "50%",
                    background: "rgba(255, 112, 150, 0.35)",
                    filter: "blur(1px)"
                  }}
                />
              ))}

              {/* Nose + mouth */}
              <div
                style={{
                  position: "absolute",
                  top: "74px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "12px",
                  height: "8px",
                  borderRadius: "50% 50% 60% 60%",
                  background: "#FF7096"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "78px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "1.1rem",
                  color: "#A81440",
                  fontWeight: 700,
                  lineHeight: 1
                }}
              >
                ω
              </div>
            </div>

            {/* Little paws holding a heart */}
            <div
              style={{
                position: "absolute",
                top: "212px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                zIndex: 3
              }}
            >
              <div style={{ width: "30px", height: "24px", borderRadius: "50%", background: "#FFF", boxShadow: "0 3px 8px rgba(238,78,123,0.15)" }} />
              <span className="animate-pulse-slow" style={{ fontSize: "1.8rem", display: "inline-block", margin: "0 -8px", zIndex: 1 }}>
                💗
              </span>
              <div style={{ width: "30px", height: "24px", borderRadius: "50%", background: "#FFF", boxShadow: "0 3px 8px rgba(238,78,123,0.15)" }} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", fontWeight: 600, marginBottom: "28px", minHeight: "1.4em" }}>
        {boops === 0 ? "psst… tap the bunny 🐰" : `boops given: ${boops} 💗`}
      </p>

      {/* Quick nav to the new surprises */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 42vw), 1fr))",
          gap: "10px",
          width: "100%",
          maxWidth: "680px"
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn-cute-secondary"
            onClick={() => {
              sounds.playPop(640);
              onScrollTo(item.id);
            }}
            style={{ width: "100%", whiteSpace: "nowrap", paddingLeft: "10px", paddingRight: "10px" }}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          sounds.playPop(620);
          onScrollTo("jar-section");
        }}
        aria-label="Scroll to the first surprise"
        style={{
          marginTop: "32px",
          background: "transparent",
          border: "none",
          color: "var(--color-pink-400)",
          cursor: "pointer",
          padding: "8px",
          animation: "gentleFloat 3s infinite ease-in-out"
        }}
      >
        <ChevronDown size={26} />
      </button>
    </section>
  );
}
