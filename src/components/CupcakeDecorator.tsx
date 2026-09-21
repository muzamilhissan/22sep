"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CakeSlice, RotateCcw } from "lucide-react";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const FROSTINGS = [
  { id: "strawberry", name: "Strawberry", light: "#FFD6E0", dark: "#FF8FA3" },
  { id: "vanilla", name: "Vanilla", light: "#FFFBF0", dark: "#F6DFA8" },
  { id: "lavender", name: "Lavender", light: "#F1E6FF", dark: "#C5A3FF" },
  { id: "mint", name: "Mint", light: "#E3FAEE", dark: "#9EDFC0" }
];

const TOPPINGS = [
  { id: "none", emoji: "", name: "Plain" },
  { id: "cherry", emoji: "🍒", name: "Cherry" },
  { id: "strawberry", emoji: "🍓", name: "Strawberry" },
  { id: "heart", emoji: "💗", name: "Heart" },
  { id: "star", emoji: "⭐", name: "Star" },
  { id: "bow", emoji: "🎀", name: "Bow" }
];

const SPRINKLE_COLORS = ["#FF7096", "#F3C969", "#9EDFC0", "#C5A3FF", "#FFFFFF", "#7EC8F0"];
const SPRINKLES_PER_SHAKE = 8;
const MAX_SPRINKLES = 48;

// Sunflower-pattern positions spread evenly over the frosting dome
const SPRINKLE_SPOTS = Array.from({ length: MAX_SPRINKLES }, (_, k) => {
  const angle = k * 2.39996;
  const r = Math.sqrt((k + 0.5) / MAX_SPRINKLES);
  return {
    x: Math.round(Math.cos(angle) * r * 62),
    y: Math.round(Math.sin(angle) * r * 40),
    rot: (k * 53) % 180,
    color: SPRINKLE_COLORS[k % SPRINKLE_COLORS.length]
  };
});

export default function CupcakeDecorator() {
  const [frosting, setFrosting] = useState(FROSTINGS[0]);
  const [topping, setTopping] = useState(TOPPINGS[1]);
  const [sprinkles, setSprinkles] = useState(0);
  const [hasCandle, setHasCandle] = useState(false);
  const [isServed, setIsServed] = useState(false);

  const change = (fn: () => void) => {
    fn();
    setIsServed(false);
  };

  const serve = () => {
    sounds.playSparkle();
    setIsServed(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: [frosting.dark, "#FF7096", "#F3C969", "#FFFFFF"] });
  };

  const reset = () => {
    sounds.playPop(500);
    setFrosting(FROSTINGS[0]);
    setTopping(TOPPINGS[1]);
    setSprinkles(0);
    setHasCandle(false);
    setIsServed(false);
  };

  const cupcakeName = `${frosting.name} Dream${topping.emoji ? ` with a ${topping.name.toLowerCase()} on top` : ""}`;

  const chipStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    minHeight: "44px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: `1.5px solid ${active ? "var(--color-pink-400)" : "var(--color-pink-200)"}`,
    background: active ? "var(--color-pink-100)" : "rgba(255,255,255,0.9)",
    color: "var(--color-text-main)",
    fontWeight: 600,
    fontSize: "0.85rem",
    fontFamily: "inherit",
    cursor: "pointer"
  });

  const label: React.CSSProperties = { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-pink-500)", margin: "18px 0 8px" };

  return (
    <section id="cupcake-section" className="section-wrap">
      <div
        className="glass-panel"
        style={{ width: "100%", maxWidth: "760px", padding: "50px 30px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <SectionHeader
          icon={<CakeSlice size={14} />}
          badge="Cupcake Decorator"
          title="Design Your Birthday Cupcake 🧁"
          subtitle="Pick a frosting, shake on the sprinkles, add a topping, and serve it. Zero calories, maximum cuteness."
        />

        {/* The cupcake */}
        <div style={{ position: "relative", width: "220px", height: "250px", marginBottom: "4px" }}>
          {/* Candle */}
          {hasCandle && (
            <div style={{ position: "absolute", top: "0px", left: "50%", translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 4, animation: "popIn 0.35s ease both" }}>
              <div
                className="animate-flame"
                style={{ width: "12px", height: "20px", background: "radial-gradient(ellipse at bottom, #FFFFFF 0%, #FFD000 45%, #FF7096 90%)", borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%" }}
              />
              <div style={{ width: "10px", height: "34px", borderRadius: "3px", background: "repeating-linear-gradient(45deg, #FFFFFF 0 4px, #FF9EBB 4px 8px)" }} />
            </div>
          )}

          {/* Topping */}
          {topping.emoji && (
            <span key={topping.id} style={{ position: "absolute", top: hasCandle ? "38px" : "28px", left: hasCandle ? "calc(50% + 24px)" : "50%", translate: "-50% 0", fontSize: "2.4rem", zIndex: 3, animation: "popIn 0.35s ease both" }}>
              {topping.emoji}
            </span>
          )}

          {/* Frosting swirl: three stacked layers + a tip */}
          {[
            { top: 118, w: 190, h: 58 },
            { top: 94, w: 158, h: 54 },
            { top: 72, w: 118, h: 50 }
          ].map((layer, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${layer.top}px`,
                left: "50%",
                transform: "translateX(-50%)",
                width: `${layer.w}px`,
                height: `${layer.h}px`,
                borderRadius: "50%",
                background: `radial-gradient(ellipse at 40% 30%, ${frosting.light} 0%, ${frosting.dark} 110%)`,
                boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.06)",
                transition: "background 0.35s ease",
                zIndex: 1
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "52px",
              left: "50%",
              width: "40px",
              height: "40px",
              transform: "translateX(-50%) rotate(45deg)",
              borderRadius: "50% 0 50% 50%",
              background: `radial-gradient(circle at 35% 35%, ${frosting.light}, ${frosting.dark})`,
              transition: "background 0.35s ease",
              zIndex: 1
            }}
          />

          {/* Sprinkles */}
          {SPRINKLE_SPOTS.slice(0, sprinkles).map((s, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                top: `${128 + s.y}px`,
                left: `calc(50% + ${s.x}px)`,
                width: "4px",
                height: "11px",
                borderRadius: "3px",
                background: s.color,
                boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
                // Separate rotate/translate properties so the pop-in animation's transform doesn't wipe them
                rotate: `${s.rot}deg`,
                animation: "popIn 0.3s ease both",
                zIndex: 2
              }}
            />
          ))}

          {/* Liner */}
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "164px",
              height: "86px",
              clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)",
              background: "repeating-linear-gradient(90deg, #FF8FA3 0 12px, #FFB3C6 12px 24px)",
              borderRadius: "0 0 14px 14px"
            }}
          />
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "150px", height: "14px", borderRadius: "50%", background: "rgba(238, 78, 123, 0.15)", filter: "blur(4px)", zIndex: -1 }} />
        </div>

        {isServed && (
          <div
            className="font-handwriting"
            style={{
              background: "#FFFBF7",
              border: "1.5px solid #FFC2D4",
              borderRadius: "12px",
              padding: "8px 18px",
              fontSize: "clamp(1.3rem, 5vw, 1.5rem)",
              color: "var(--color-pink-600)",
              boxShadow: "0 6px 16px rgba(238, 78, 123, 0.15)",
              animation: "popIn 0.4s ease both",
              rotate: "-1.5deg",
              marginBottom: "6px",
              lineHeight: 1.25
            }}
          >
            Eraj&apos;s Special: the {cupcakeName} 🧁
          </div>
        )}

        {/* Controls */}
        <p style={label}>FROSTING</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {FROSTINGS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              className="btn-choice"
              aria-pressed={frosting.id === f.id}
              onClick={() => change(() => {
                sounds.playPluck(i + 2);
                setFrosting(f);
              })}
              style={chipStyle(frosting.id === f.id)}
            >
              <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: `linear-gradient(135deg, ${f.light}, ${f.dark})`, border: "1px solid rgba(0,0,0,0.08)" }} />
              {f.name}
            </button>
          ))}
        </div>

        <p style={label}>TOPPING</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {TOPPINGS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn-choice"
              aria-pressed={topping.id === t.id}
              aria-label={`${t.name} topping`}
              onClick={() => change(() => {
                sounds.playPop(900);
                setTopping(t);
              })}
              style={{ ...chipStyle(topping.id === t.id), width: "48px", height: "48px", padding: 0, fontSize: t.emoji ? "1.4rem" : "0.72rem" }}
            >
              {t.emoji || "none"}
            </button>
          ))}
        </div>

        <p style={label}>EXTRAS</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "22px" }}>
          <button
            type="button"
            className="btn-choice"
            onClick={() => change(() => {
              if (sprinkles >= MAX_SPRINKLES) {
                sounds.playBoop();
                return;
              }
              sounds.playSprinkle();
              setSprinkles((n) => Math.min(MAX_SPRINKLES, n + SPRINKLES_PER_SHAKE));
            })}
            style={chipStyle(sprinkles > 0)}
          >
            ✨ {sprinkles >= MAX_SPRINKLES ? "Max sprinkles!" : "Shake sprinkles"}
          </button>
          <button
            type="button"
            className="btn-choice"
            aria-pressed={hasCandle}
            onClick={() => change(() => {
              sounds.playChime();
              setHasCandle((c) => !c);
            })}
            style={chipStyle(hasCandle)}
          >
            🕯️ {hasCandle ? "Candle on" : "Add a candle"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          <button type="button" className="btn-cute-primary" onClick={serve}>
            <span>Serve it! 🎉</span>
          </button>
          <button type="button" className="btn-cute-secondary" onClick={reset}>
            <RotateCcw size={16} />
            <span>Start over</span>
          </button>
        </div>
      </div>
    </section>
  );
}
