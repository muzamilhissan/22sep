"use client";

import React, { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const STORAGE_KEY = "eraj-coupons";
const COUPONS = BIRTHDAY_DATA.coupons;
const STUB_COLORS = ["#FFB3C6", "#FCE8B3", "#E5D4FF", "#FFD6E0"];

// Ticket notches cut into both sides
const TICKET_MASK =
  "radial-gradient(circle at 0 50%, transparent 11px, #000 11.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 11px, #000 11.5px) right / 51% 100% no-repeat";

function loadRedeemed(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function CouponBook() {
  // Mounted client-side only, so reading saved progress here is safe
  const [redeemed, setRedeemed] = useState<string[]>(loadRedeemed);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(redeemed));
    } catch {
      // storage unavailable — redemptions just won't persist
    }
  }, [redeemed]);

  const toggle = (id: string) => {
    if (redeemed.includes(id)) {
      sounds.playPop(420);
      setRedeemed((r) => r.filter((x) => x !== id));
    } else {
      sounds.playStamp();
      setTimeout(() => sounds.playSparkle(), 150);
      setRedeemed((r) => [...r, id]);
    }
  };

  return (
    <section id="coupon-section" className="section-wrap">
      <div style={{ width: "100%", maxWidth: "820px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <SectionHeader
          icon={<Ticket size={14} />}
          badge="Birthday Coupon Book"
          title="Coupons, Valid All Year 🎟️"
          subtitle="Tap a coupon to stamp it redeemed, then screenshot it and send it over to cash it in. (Tap again to un-stamp.)"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
            gap: "16px",
            width: "100%"
          }}
        >
          {COUPONS.map((c, i) => {
            const isRedeemed = redeemed.includes(c.id);
            return (
              <div key={c.id} style={{ filter: "drop-shadow(0 8px 14px rgba(238, 78, 123, 0.16))" }}>
                <button
                  type="button"
                  className="btn-choice"
                  aria-pressed={isRedeemed}
                  aria-label={`${c.title}${isRedeemed ? " (redeemed)" : ""}`}
                  onClick={() => toggle(c.id)}
                  style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "104px",
                    display: "flex",
                    alignItems: "stretch",
                    border: "none",
                    padding: 0,
                    background: "#FFFFFF",
                    borderRadius: "14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    WebkitMask: TICKET_MASK,
                    mask: TICKET_MASK
                  }}
                >
                  {/* Stub */}
                  <div
                    style={{
                      width: "84px",
                      flexShrink: 0,
                      background: STUB_COLORS[i % STUB_COLORS.length],
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2px",
                      borderRight: "2px dashed rgba(255,255,255,0.9)"
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>{c.emoji}</span>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--color-pink-700)" }}>No. {String(i + 1).padStart(2, "0")}</span>
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, padding: "14px 22px 14px 16px", opacity: isRedeemed ? 0.45 : 1, transition: "opacity 0.3s ease" }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em", color: "var(--color-pink-400)", marginBottom: "2px" }}>
                      THIS COUPON ENTITLES ERAJ TO
                    </p>
                    <p className="font-playfair" style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--color-pink-700)", lineHeight: 1.25, marginBottom: "4px" }}>
                      {c.title}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>{c.finePrint}</p>
                  </div>

                  {isRedeemed && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "72%",
                        left: "68%",
                        padding: "3px 10px",
                        border: "3px double #D8265B",
                        borderRadius: "8px",
                        color: "#D8265B",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        letterSpacing: "0.1em",
                        whiteSpace: "nowrap",
                        background: "rgba(255, 240, 244, 0.6)",
                        animation: "stampIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both"
                      }}
                    >
                      REDEEMED ♡
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: "18px", fontSize: "0.85rem", color: "var(--color-text-light)", fontWeight: 600 }}>
          {redeemed.length === 0 ? "No coupons used yet. Go on, treat yourself 😌" : `${redeemed.length} of ${COUPONS.length} coupons redeemed 🎟️`}
        </p>
      </div>
    </section>
  );
}
