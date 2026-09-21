"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { BIRTHDAY_DATA, PhotoItem } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";
import SectionHeader from "@/components/SectionHeader";

const STICKERS = ["🎀", "💗", "🌸", "✨", "🍓", "🦋", "🧁", "⭐"];
const PHOTOS = BIRTHDAY_DATA.photos;

// Split photos into booth strips of up to 4 frames
const STRIPS: PhotoItem[][] = [];
for (let i = 0; i < PHOTOS.length; i += 4) STRIPS.push(PHOTOS.slice(i, i + 4));

export default function PhotoBooth() {
  const [selected, setSelected] = useState<PhotoItem | null>(null);
  const [flashKey, setFlashKey] = useState(0);

  // Lock background scroll + allow Escape to close while the preview is open
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const snap = (photo: PhotoItem) => {
    sounds.playShutter();
    setFlashKey((k) => k + 1);
    setTimeout(() => setSelected(photo), 180);
  };

  return (
    <section id="booth-section" className="section-wrap">
      <div style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <SectionHeader
          icon={<Camera size={14} />}
          badge="The Eraj Photo Booth"
          title="Say Cheese! 📸"
          subtitle="Your favourite moments, printed as little photo-booth strips with stickers on top. Tap any frame to snap it bigger."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "36px 28px",
            width: "100%",
            maxWidth: "620px",
            justifyItems: "center"
          }}
        >
          {STRIPS.map((strip, stripIdx) => (
            <div
              key={stripIdx}
              style={{
                width: "100%",
                maxWidth: "270px",
                background: stripIdx % 2 === 0 ? "#FFFFFF" : "#FFF0F4",
                padding: "14px 14px 18px",
                borderRadius: "10px",
                boxShadow: "0 16px 36px -6px rgba(220, 80, 120, 0.25)",
                transform: `rotate(${stripIdx % 2 === 0 ? -2 : 2}deg)`,
                position: "relative"
              }}
            >
              <div className="washi-tape" style={{ background: stripIdx % 2 === 0 ? "rgba(255, 182, 193, 0.85)" : "rgba(255, 218, 185, 0.85)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {strip.map((photo, i) => {
                  const idx = stripIdx * 4 + i;
                  return (
                    <div
                      key={photo.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open photo: ${photo.title}`}
                      className="pressable"
                      onClick={() => snap(photo)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          snap(photo);
                        }
                      }}
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4 / 3",
                        borderRadius: "4px",
                        overflow: "hidden",
                        background: "#FCE8EE"
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 640px) 90vw, 270px"
                        placeholder={photo.blurDataURL ? "blur" : "empty"}
                        blurDataURL={photo.blurDataURL}
                        style={{ objectFit: "cover" }}
                      />
                      {/* Sticker */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          [idx % 2 === 0 ? "right" : "left"]: "6px",
                          [idx % 3 === 0 ? "top" : "bottom"]: "4px",
                          fontSize: "1.6rem",
                          transform: `rotate(${idx % 2 === 0 ? 14 : -14}deg)`,
                          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                        }}
                      >
                        {STICKERS[idx % STICKERS.length]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="font-handwriting" style={{ marginTop: "12px", fontSize: "1.35rem", color: "var(--color-pink-600)", lineHeight: 1 }}>
                eraj ♡ 22.09
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Camera flash */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "#FFFFFF",
            pointerEvents: "none",
            zIndex: 400,
            animation: "cameraFlash 0.45s ease-out forwards"
          }}
        />
      )}

      {/* Developed photo preview */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(74, 46, 53, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
            padding: "max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))",
            overscrollBehavior: "contain"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#FFFFFF",
              padding: "14px 14px 20px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "92dvh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              transform: "rotate(-1deg)",
              animation: "popIn 0.35s ease both"
            }}
          >
            <button
              type="button"
              onClick={() => {
                sounds.playPop(500);
                setSelected(null);
              }}
              aria-label="Close photo"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255, 255, 255, 0.92)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2
              }}
            >
              <X size={20} color="#4A2E35" />
            </button>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(240px, 55dvh, 460px)",
                borderRadius: "4px",
                overflow: "hidden",
                background: "#FCE8EE",
                animation: "develop 1.2s ease-out both"
              }}
            >
              <Image src={selected.src} alt={selected.title} fill sizes="(max-width: 640px) 100vw, 520px" style={{ objectFit: "cover" }} priority />
            </div>

            <div style={{ padding: "14px 6px 0", textAlign: "center" }}>
              <p className="font-handwriting" style={{ fontSize: "clamp(1.5rem, 6vw, 1.8rem)", color: "var(--color-pink-600)", lineHeight: 1.1 }}>
                {selected.title}
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginTop: "6px", lineHeight: 1.5 }}>{selected.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
