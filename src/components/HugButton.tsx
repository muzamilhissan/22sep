"use client";

import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { HeartHandshake } from "lucide-react";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const STORAGE_KEY = "eraj-hugs";
const HOLD_MS = 1600;
const TICK_MS = 50;

const DELIVERED_LINES = [
  "Hug delivered! 🤗",
  "Extra-squeezy hug sent! 💞",
  "Warm hug incoming… received! 🧸",
  "Certified cozy hug ✨",
  "Hug + forehead kiss combo 💋",
  "Bear-hug level: MAXIMUM 🐻"
];

function loadHugs(): number {
  try {
    const n = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export default function HugButton() {
  const [progress, setProgress] = useState(0);
  const [hugs, setHugs] = useState<number>(loadHugs);
  const [message, setMessage] = useState("Press and hold the heart 💗");
  const [justHugged, setJustHugged] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(hugs));
    } catch {
      // storage unavailable — count just won't persist
    }
  }, [hugs]);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const deliverHug = () => {
    stopTimer();
    sounds.playKiss();
    const total = hugs + 1;
    setHugs(total);
    setMessage(DELIVERED_LINES[(total - 1) % DELIVERED_LINES.length]);
    setJustHugged(true);
    setTimeout(() => setJustHugged(false), 900);

    const heart = confetti.shapeFromText({ text: "💗", scalar: 2 });
    confetti({
      shapes: [heart],
      scalar: 2,
      particleCount: 40,
      spread: 100,
      startVelocity: 32,
      origin: { y: 0.6 }
    });

    // Let the full heart linger for a moment, then empty it
    setTimeout(() => {
      progressRef.current = 0;
      setProgress(0);
    }, 700);
  };

  const startHold = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (timer.current || progressRef.current >= 1) return;
    setMessage("Keep holding… 🥰");
    let ticks = 0;
    timer.current = setInterval(() => {
      const next = Math.min(1, progressRef.current + TICK_MS / HOLD_MS);
      progressRef.current = next;
      setProgress(next);
      if (ticks++ % 4 === 0) sounds.playHugTick(next);
      if (next >= 1) deliverHug();
    }, TICK_MS);
  };

  const endHold = () => {
    if (!timer.current) return;
    stopTimer();
    if (progressRef.current < 1) {
      sounds.playBoop();
      setMessage("Aww, hold a little longer 🥺");
      progressRef.current = 0;
      setProgress(0);
    }
  };

  return (
    <section id="hug-section" className="section-wrap">
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
          icon={<HeartHandshake size={14} />}
          badge="Hug Machine"
          title="Can't Hug You in Person? 🤗"
          subtitle="Press and hold the heart until it fills all the way up to send a big, squishy virtual hug. Unlimited refills."
        />

        <div
          role="button"
          tabIndex={0}
          aria-label="Press and hold to send a hug"
          className="pressable"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
              e.preventDefault();
              progressRef.current = 1;
              setProgress(1);
              deliverHug();
            }
          }}
          style={{
            position: "relative",
            width: "200px",
            height: "185px",
            touchAction: "none",
            transform: justHugged ? "scale(1.12)" : progress > 0 ? `scale(${1 - progress * 0.06})` : "scale(1)",
            transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            animation: progress === 0 && !justHugged ? "heartThump 1.6s ease-in-out infinite" : undefined,
            marginBottom: "14px"
          }}
        >
          <svg viewBox="0 0 24 22" width="200" height="185" aria-hidden="true" style={{ overflow: "visible" }}>
            <defs>
              <clipPath id="hug-heart-clip">
                <path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 1.8 4 5.8 3.2 8.3 2.7 10.4 4 12 6c1.6-2 3.7-3.3 6.2-2.8 4 .8 5.5 5.2 3.8 8.5C19.5 16.4 12 21 12 21z" />
              </clipPath>
              <linearGradient id="hug-heart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF7096" />
                <stop offset="100%" stopColor="#D8265B" />
              </linearGradient>
            </defs>
            <path
              d="M12 21s-7.5-4.6-10-9.3C.3 8.4 1.8 4 5.8 3.2 8.3 2.7 10.4 4 12 6c1.6-2 3.7-3.3 6.2-2.8 4 .8 5.5 5.2 3.8 8.5C19.5 16.4 12 21 12 21z"
              fill="#FFE1EB"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              style={{ filter: "drop-shadow(0 6px 10px rgba(238, 78, 123, 0.3))" }}
            />
            <g clipPath="url(#hug-heart-clip)">
              <rect x="0" y={22 - progress * 20} width="24" height="22" fill="url(#hug-heart-fill)" />
            </g>
            {/* Shine */}
            <ellipse cx="7" cy="7.5" rx="2" ry="1.2" fill="rgba(255,255,255,0.75)" transform="rotate(-35 7 7.5)" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: progress > 0.62 ? "#FFFFFF" : "var(--color-pink-700)",
              textShadow: progress > 0.62 ? "0 1px 4px rgba(168, 20, 64, 0.5)" : "0 1px 3px rgba(255, 255, 255, 0.9)",
              pointerEvents: "none",
              transition: "color 0.2s ease"
            }}
          >
            {progress > 0 ? `${Math.round(progress * 100)}%` : "HUG"}
          </span>
        </div>

        <p key={message} style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-pink-600)", minHeight: "1.6em", animation: "popIn 0.3s ease both" }}>
          {message}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", fontWeight: 600, marginTop: "6px" }}>
          {hugs === 0 ? "No hugs sent yet… 👀" : `${hugs} hug${hugs === 1 ? "" : "s"} sent to Eraj so far`}
        </p>
      </div>
    </section>
  );
}
