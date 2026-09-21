"use client";

import React, { useState } from "react";
import { Cookie } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const FORTUNES = BIRTHDAY_DATA.fortunes;

export default function FortuneCookie() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"whole" | "shaking" | "cracked">("whole");
  const [opened, setOpened] = useState(0);

  const crack = () => {
    if (stage !== "whole") return;
    sounds.playPop(420);
    setStage("shaking");
    setTimeout(() => {
      sounds.playCrunch();
      setStage("cracked");
      setOpened((n) => n + 1);
      setTimeout(() => sounds.playChime(), 250);
    }, 380);
  };

  const another = () => {
    sounds.playPop(700);
    setIndex((i) => (i + 1) % FORTUNES.length);
    setStage("whole");
  };

  const luckyNumbers = [21, 22, ((index * 7) % 40) + 1, ((index * 13) % 60) + 9];
  const halfStyle: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6.5rem", lineHeight: 1 };

  return (
    <section id="fortune-section" className="section-wrap">
      <div
        className="glass-panel"
        style={{ width: "100%", maxWidth: "760px", padding: "50px 30px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <SectionHeader
          icon={<Cookie size={14} />}
          badge="Fortune Cookie"
          title="Crack Open Your Future 🥠"
          subtitle="Tap the cookie to see what your 21st year has in store. Don't like it? There's always another cookie."
        />

        <div
          role="button"
          tabIndex={0}
          aria-label={stage === "cracked" ? "Fortune cookie (opened)" : "Crack the fortune cookie"}
          className="pressable"
          onClick={crack}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              crack();
            }
          }}
          style={{
            position: "relative",
            width: "180px",
            height: "130px",
            marginBottom: "8px",
            animation: stage === "shaking" ? "cookieShake 0.12s ease-in-out 3" : stage === "whole" ? "gentleFloat 3.5s ease-in-out infinite" : undefined,
            filter: "drop-shadow(0 10px 14px rgba(200, 120, 40, 0.25))"
          }}
        >
          {stage === "cracked" ? (
            <>
              <span aria-hidden="true" style={{ ...halfStyle, clipPath: "inset(0 50% 0 0)", animation: "crackLeft 0.4s ease-out forwards" }}>🥠</span>
              <span aria-hidden="true" style={{ ...halfStyle, clipPath: "inset(0 0 0 50%)", animation: "crackRight 0.4s ease-out forwards" }}>🥠</span>
            </>
          ) : (
            <span aria-hidden="true" style={halfStyle}>🥠</span>
          )}
        </div>

        {stage === "cracked" ? (
          <>
            <div
              key={index}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "420px",
                background: "#FFFFFF",
                border: "1px solid #F3D6DE",
                borderRadius: "4px",
                padding: "18px 22px 12px",
                boxShadow: "0 10px 26px rgba(238, 78, 123, 0.16)",
                animation: "slipOut 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both",
                marginBottom: "18px"
              }}
            >
              <p className="font-handwriting" style={{ fontSize: "clamp(1.35rem, 5.4vw, 1.6rem)", color: "var(--color-text-main)", lineHeight: 1.3 }}>
                {FORTUNES[index]}
              </p>
              <p style={{ marginTop: "10px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-pink-400)" }}>
                LUCKY NUMBERS
                <br />
                {luckyNumbers.join(" · ")}
              </p>
            </div>
            <button type="button" className="btn-cute-primary" onClick={another}>
              <span>Another cookie 🥠</span>
            </button>
          </>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontWeight: 600 }}>tap the cookie to crack it 👆</p>
        )}

        {opened > 0 && (
          <p style={{ marginTop: "14px", fontSize: "0.8rem", color: "var(--color-text-light)", fontWeight: 600 }}>
            {opened} cookie{opened === 1 ? "" : "s"} cracked
          </p>
        )}
      </div>
    </section>
  );
}
