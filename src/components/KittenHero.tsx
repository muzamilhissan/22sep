"use client";

import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";

interface KittenHeroProps {
  onScrollTo: (id: string) => void;
}

interface FloatingHeart {
  id: number;
  emoji: string;
  left: number;
  drift: number;
  spin: number;
}

const HEART_EMOJIS = ["💗", "🩷", "💕", "✨", "🐾", "🌸"];
const PET_DISTANCE = 110; // px of stroking before she purrs

const NAV_ITEMS = [
  { id: "balloon-section", emoji: "🎈", label: "Balloons" },
  { id: "cupcake-section", emoji: "🧁", label: "Cupcake" },
  { id: "fortune-section", emoji: "🥠", label: "Fortune" },
  { id: "coupon-section", emoji: "🎟️", label: "Coupons" }
];

export default function KittenHero({ onScrollTo }: KittenHeroProps) {
  const [mews, setMews] = useState(0);
  const [pets, setPets] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [isPurring, setIsPurring] = useState(false);
  const [line, setLine] = useState("psst… tap me, or swipe to pet me 🥺");
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const nextHeartId = useRef(0);
  const pointer = useRef<{ x: number; y: number; travelled: number; stroke: number } | null>(null);
  const purrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawnHearts = (count: number) => {
    const burst: FloatingHeart[] = Array.from({ length: count }, () => {
      const id = nextHeartId.current++;
      return {
        id,
        emoji: HEART_EMOJIS[id % HEART_EMOJIS.length],
        left: 25 + ((id * 37) % 50),
        drift: ((id * 53) % 90) - 45,
        spin: ((id * 71) % 60) - 30
      };
    });
    setHearts((prev) => [...prev.slice(-20), ...burst]);
    const ids = new Set(burst.map((h) => h.id));
    setTimeout(() => setHearts((prev) => prev.filter((h) => !ids.has(h.id))), 1300);
  };

  const mew = () => {
    const n = mews + 1;
    setMews(n);
    setPopKey((k) => k + 1);
    setLine(BIRTHDAY_DATA.kittenLines[(n - 1) % BIRTHDAY_DATA.kittenLines.length]);
    sounds.playMew();
    spawnHearts(4);
  };

  const purr = () => {
    setPets((p) => p + 1);
    setIsPurring(true);
    setLine("purrrrrr… 💗");
    sounds.playPurr();
    spawnHearts(3);
    if (purrTimer.current) clearTimeout(purrTimer.current);
    purrTimer.current = setTimeout(() => setIsPurring(false), 1600);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY, travelled: 0, stroke: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    const d = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    p.x = e.clientX;
    p.y = e.clientY;
    p.travelled += d;
    p.stroke += d;
    if (p.stroke > PET_DISTANCE) {
      p.stroke = 0;
      purr();
    }
  };

  const onPointerUp = () => {
    const p = pointer.current;
    pointer.current = null;
    if (p && p.travelled < 12) mew();
  };

  const eyes = [44, 83];

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
        <span>🍵</span>
        <span>Birthday Tea Party · Round Two</span>
        <span>🎀</span>
      </div>

      <h1
        className="font-playfair"
        style={{
          fontSize: "clamp(2.1rem, 8.5vw, 4.2rem)",
          fontWeight: 700,
          color: "var(--color-pink-700)",
          lineHeight: 1.15,
          marginBottom: "12px",
          textShadow: "0 4px 20px rgba(255, 112, 150, 0.25)"
        }}
      >
        More surprises for
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

      <p style={{ fontSize: "clamp(1rem, 3.8vw, 1.2rem)", color: "var(--color-text-muted)", maxWidth: "560px", marginBottom: "10px", lineHeight: 1.6 }}>
        {BIRTHDAY_DATA.tagline}
      </p>
      <p style={{ fontSize: "clamp(0.95rem, 3.6vw, 1.05rem)", color: "var(--color-pink-600)", fontWeight: 600 }}>
        Meet Mochi, your birthday kitten 🐱
      </p>

      {/* Kitten in a teacup */}
      <div style={{ position: "relative", width: "240px", height: "250px", marginTop: "58px", marginBottom: "6px" }}>
        {/* Speech bubble */}
        <div
          key={line + mews + pets}
          style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FFFFFF",
            border: "2px solid var(--color-pink-200)",
            borderRadius: "18px",
            padding: "7px 14px",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-pink-600)",
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-subtle)",
            animation: "bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            zIndex: 8
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
                top: "40px",
                left: `${h.left}%`,
                fontSize: "1.4rem",
                pointerEvents: "none",
                animation: "floatUpFade 1.2s ease-out forwards",
                zIndex: 9,
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
          aria-label="Tap Mochi the kitten, or swipe across her to pet her"
          className="pressable"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (pointer.current = null)}
          onPointerLeave={() => (pointer.current = null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              mew();
            }
          }}
          style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
        >
          {/* Saucer */}
          <div
            style={{
              position: "absolute",
              bottom: "2px",
              left: "10px",
              width: "220px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(180deg, #FFE1EB, #FFB3C6)",
              border: "2px solid #FFFFFF",
              boxShadow: "0 12px 24px rgba(238, 78, 123, 0.22)"
            }}
          />

          {/* Cup handle */}
          <div
            style={{
              position: "absolute",
              top: "134px",
              left: "178px",
              width: "52px",
              height: "56px",
              borderRadius: "50%",
              border: "11px solid #FF9EBB",
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6)"
            }}
          />

          {/* Inside of the cup (behind the kitten) */}
          <div
            style={{
              position: "absolute",
              top: "112px",
              left: "30px",
              width: "170px",
              height: "36px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse at 50% 60%, #E8A0B4, #F7C6D3)",
              border: "4px solid #FFD6E0"
            }}
          />

          {/* Kitten */}
          <div
            key={popKey}
            style={{
              position: "absolute",
              top: "10px",
              left: "45px",
              width: "140px",
              height: "140px",
              transformOrigin: "bottom center",
              animation: popKey ? "kittenPop 0.55s ease-out" : undefined
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "bottom center",
                animation: isPurring ? "purrWiggle 0.25s ease-in-out infinite" : undefined
              }}
            >
              {/* Ears */}
              {[
                { left: "10px", rot: "-16deg" },
                { left: "86px", rot: "16deg" }
              ].map((ear, i) => (
                <div
                  key={i}
                  style={
                    {
                      position: "absolute",
                      top: "8px",
                      left: ear.left,
                      width: "44px",
                      height: "46px",
                      "--ear-rot": ear.rot,
                      transform: `rotate(${ear.rot})`,
                      transformOrigin: "bottom center",
                      animation: `earWiggle ${3 + i * 0.7}s ease-in-out infinite`
                    } as React.CSSProperties
                  }
                >
                  <div style={{ position: "absolute", inset: 0, background: i === 0 ? "#FFD6A5" : "#FFF8F0", clipPath: "polygon(50% 0, 100% 100%, 0 100%)", borderRadius: "10px" }} />
                  <div style={{ position: "absolute", top: "14px", left: "11px", width: "22px", height: "28px", background: "#FFB3C6", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
                </div>
              ))}

              {/* Head */}
              <div
                style={{
                  position: "absolute",
                  top: "34px",
                  left: 0,
                  width: "140px",
                  height: "108px",
                  borderRadius: "50% 50% 46% 46% / 56% 56% 44% 44%",
                  background: "radial-gradient(circle at 45% 35%, #FFFFFF 0%, #FFF8F0 70%, #FFEFE4 100%)",
                  boxShadow: "0 10px 22px rgba(238, 78, 123, 0.16)",
                  overflow: "hidden"
                }}
              >
                {/* Calico patch */}
                <div style={{ position: "absolute", top: "-18px", left: "-10px", width: "60px", height: "50px", borderRadius: "50%", background: "#FFD6A5", opacity: 0.9 }} />

                {/* Eyes: open ovals, or happy ^ ^ while purring */}
                {eyes.map((left, i) =>
                  isPurring ? (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: "44px",
                        left: `${left - 2}px`,
                        width: "18px",
                        height: "10px",
                        borderTop: "3.5px solid #4A2E35",
                        borderRadius: "50% 50% 0 0"
                      }}
                    />
                  ) : (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: "40px",
                        left: `${left}px`,
                        width: "14px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#4A2E35",
                        animation: "blink 5s infinite"
                      }}
                    >
                      <div style={{ position: "absolute", top: "3px", left: "3px", width: "5px", height: "5px", borderRadius: "50%", background: "#FFF" }} />
                    </div>
                  )
                )}

                {/* Cheeks */}
                {[20, 100].map((left, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "62px",
                      left: `${left}px`,
                      width: "22px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isPurring ? "rgba(255, 112, 150, 0.55)" : "rgba(255, 112, 150, 0.35)",
                      transition: "background 0.3s ease"
                    }}
                  />
                ))}

                {/* Nose + mouth */}
                <div style={{ position: "absolute", top: "58px", left: "50%", transform: "translateX(-50%)", width: "10px", height: "7px", borderRadius: "50% 50% 60% 60%", background: "#FF7096" }} />
                <div style={{ position: "absolute", top: "61px", left: "50%", transform: "translateX(-50%)", fontSize: "1rem", color: "#A81440", fontWeight: 700, lineHeight: 1 }}>
                  ω
                </div>

                {/* Whiskers */}
                {[-1, 1].map((side) =>
                  [-8, 0, 8].map((tilt, j) => (
                    <div
                      key={`${side}-${j}`}
                      style={{
                        position: "absolute",
                        top: `${60 + j * 6}px`,
                        [side < 0 ? "left" : "right"]: "2px",
                        width: "24px",
                        height: "1.5px",
                        background: "rgba(74, 46, 53, 0.35)",
                        transform: `rotate(${side * tilt}deg)`
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cup front */}
          <div
            style={{
              position: "absolute",
              top: "128px",
              left: "30px",
              width: "170px",
              height: "100px",
              borderRadius: "0 0 85px 85px / 0 0 96px 96px",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.85) 3px, transparent 3.5px) 0 0 / 22px 22px, linear-gradient(180deg, #FFB3C6 0%, #FF8FA3 100%)",
              borderTop: "5px solid #FFD6E0",
              boxShadow: "inset -10px -8px 0 rgba(216, 38, 91, 0.12)"
            }}
          />

          {/* Paws on the rim */}
          {[62, 132].map((left, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "120px",
                left: `${left}px`,
                width: "34px",
                height: "20px",
                borderRadius: "50%",
                background: i === 0 ? "#FFF8F0" : "#FFD6A5",
                boxShadow: "0 3px 6px rgba(238, 78, 123, 0.18)"
              }}
            />
          ))}
        </div>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", fontWeight: 600, marginBottom: "26px", minHeight: "1.4em" }}>
        {mews + pets === 0 ? "tap to say hi · swipe to pet" : `mews: ${mews} · pets: ${pets} 🐾`}
      </p>

      {/* Quick nav to the new surprises */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(130px, 42vw), 1fr))", gap: "10px", width: "100%", maxWidth: "640px" }}>
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
          onScrollTo("balloon-section");
        }}
        aria-label="Scroll to the first surprise"
        style={{ marginTop: "30px", background: "transparent", border: "none", color: "var(--color-pink-400)", cursor: "pointer", padding: "8px", animation: "gentleFloat 3s infinite ease-in-out" }}
      >
        <ChevronDown size={26} />
      </button>
    </section>
  );
}
