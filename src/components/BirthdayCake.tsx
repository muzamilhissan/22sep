"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Flame, RotateCcw, Heart, Gift } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

export default function BirthdayCake() {
  // 21 candles for her 21st birthday!
  const totalCandles = 21;
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(totalCandles).fill(true));
  const [hasMadeWish, setHasMadeWish] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);

  const activeCount = litCandles.filter(Boolean).length;
  const isSwiping = useRef(false);

  // Lock page scroll while the wish modal is open (prevents background scroll on mobile)
  useEffect(() => {
    if (!showWishModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showWishModal]);

  const triggerConfettiCelebration = () => {
    // Left burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969", "#FFFFFF"]
    });
    // Right burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969", "#FFFFFF"]
    });
    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#EE4E7B", "#F3C969", "#FF9EBB", "#FFCCD5"]
      });
    }, 250);
  };

  // Mirror of litCandles so rapid swipe events never act on stale state
  const litRef = useRef(litCandles);

  const blowOutCandle = (index: number) => {
    if (!litRef.current[index]) return;

    sounds.playCandleBlow();
    const newCandles = [...litRef.current];
    newCandles[index] = false;
    litRef.current = newCandles;
    setLitCandles(newCandles);

    const remaining = newCandles.filter(Boolean).length;
    if (remaining === 0) {
      setHasMadeWish(true);
      setShowWishModal(true);
      triggerConfettiCelebration();
    }
  };

  // Swipe a finger (or drag the mouse) across the candles to blow them out one by one
  const blowCandleAtPoint = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>("[data-candle-idx]");
    if (el) blowOutCandle(Number(el.dataset.candleIdx));
  };

  const blowAllCandles = () => {
    sounds.playCandleBlow();
    litRef.current = Array(totalCandles).fill(false);
    setLitCandles(litRef.current);
    setHasMadeWish(true);
    setShowWishModal(true);
    triggerConfettiCelebration();
  };

  const relightCandles = () => {
    sounds.playSparkle();
    litRef.current = Array(totalCandles).fill(true);
    setLitCandles(litRef.current);
    setHasMadeWish(false);
  };

  return (
    <section
      id="cake-section"
      className="section-pad"
      style={{
        padding: "80px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "850px",
          padding: "50px 30px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 225, 235, 0.8)",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-pink-600)",
            marginBottom: "12px"
          }}
        >
          <Sparkles size={14} />
          <span>Interactive 21st Birthday Cake</span>
        </div>

        <h2
          className="font-playfair"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--color-pink-700)",
            marginBottom: "10px"
          }}
        >
          Make a Wish & Blow the Candles 🎂
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-muted)",
            maxWidth: "520px",
            marginBottom: "32px"
          }}
        >
          {activeCount > 0
            ? `Tap each glowing candle (or swipe across them) — or use the button below to blow out all ${activeCount} candles!`
            : "All 21 candles have been blown! Your birthday wish is winging its way to the stars! ✨"}
        </p>

        {/* The Cake Stage */}
        <div className="cake-stage">
          {/* Candles Array Container (21 Candles) */}
          <div
            className="candle-row"
            onPointerDown={(e) => {
              isSwiping.current = true;
              blowCandleAtPoint(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (isSwiping.current) blowCandleAtPoint(e.clientX, e.clientY);
            }}
            onPointerUp={() => (isSwiping.current = false)}
            onPointerCancel={() => (isSwiping.current = false)}
            onPointerLeave={() => (isSwiping.current = false)}
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
              width: "280px",
              marginBottom: "-6px",
              padding: "10px 0 4px",
              zIndex: 10
            }}
          >
            {litCandles.map((isLit, idx) => (
              <div
                key={idx}
                data-candle-idx={idx}
                className="candle-hit"
                role="button"
                aria-label={isLit ? `Blow out candle ${idx + 1}` : `Candle ${idx + 1} blown out`}
                aria-disabled={!isLit}
                tabIndex={isLit ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    blowOutCandle(idx);
                  }
                }}
                title={isLit ? `Candle #${idx + 1}: Tap to blow out` : "Blown out"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: isLit ? "pointer" : "default",
                  position: "relative",
                  width: "14px",
                  transition: "transform 0.2s ease"
                }}
              >
                {/* Flame / Smoke */}
                <div
                  style={{
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {isLit ? (
                    <div
                      className="animate-flame"
                      style={{
                        width: "10px",
                        height: "16px",
                        background: "radial-gradient(ellipse at bottom, #FFFFFF 0%, #FFD000 45%, #FF7096 90%)",
                        borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                        boxShadow: "0 0 10px #FFD000, 0 0 16px #FF7096"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "3px",
                        height: "8px",
                        background: "#8A6570",
                        borderRadius: "2px",
                        opacity: 0.6
                      }}
                    />
                  )}
                </div>

                {/* Candle Stick */}
                <div
                  style={{
                    width: "8px",
                    height: "26px",
                    background:
                      idx % 2 === 0
                        ? "linear-gradient(to bottom, #FFCCD5, #FF7096)"
                        : "linear-gradient(to bottom, #FFF0F5, #FFB3C6)",
                    borderRadius: "3px 3px 1px 1px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    position: "relative"
                  }}
                >
                  {/* Spiral stripe effect */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.7) 3px, rgba(255,255,255,0.7) 6px)",
                      borderRadius: "inherit"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Tier 1 (Top Tier) */}
          <div
            style={{
              width: "220px",
              height: "55px",
              background: "linear-gradient(180deg, #FFF0F4 0%, #FFCCD5 100%)",
              borderRadius: "16px 16px 6px 6px",
              position: "relative",
              boxShadow: "inset 0 4px 10px rgba(255,255,255,0.8), 0 4px 12px rgba(238,78,123,0.15)",
              border: "2px solid #FFAFCC",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3
            }}
          >
            {/* Frosting Drips */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "14px",
                background: "#FFFFFF",
                borderRadius: "16px 16px 10px 10px",
                boxShadow: "0 2px 5px rgba(238,78,123,0.1)"
              }}
            />
            <span
              className="font-script"
              style={{
                fontSize: "1.4rem",
                color: "var(--color-pink-600)",
                fontWeight: 700,
                marginTop: "8px"
              }}
            >
              Eraj • 21
            </span>
          </div>

          {/* Cake Tier 2 (Middle Tier) */}
          <div
            style={{
              width: "290px",
              height: "65px",
              background: "linear-gradient(180deg, #FFE1EB 0%, #FFB3C6 100%)",
              borderRadius: "18px 18px 8px 8px",
              marginTop: "-4px",
              position: "relative",
              boxShadow: "inset 0 4px 10px rgba(255,255,255,0.8), 0 6px 16px rgba(238,78,123,0.15)",
              border: "2px solid #FF8FA3",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 18px",
              zIndex: 2
            }}
          >
            {/* Frosting Drips */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "16px",
                background: "#FFF5F7",
                borderRadius: "18px 18px 10px 10px"
              }}
            />
            <span style={{ fontSize: "1.2rem", marginTop: "10px" }}>🍓</span>
            <span style={{ fontSize: "1.1rem", marginTop: "10px" }}>🌸</span>
            <span style={{ fontSize: "1.2rem", marginTop: "10px" }}>🍓</span>
            <span style={{ fontSize: "1.1rem", marginTop: "10px" }}>🌸</span>
            <span style={{ fontSize: "1.2rem", marginTop: "10px" }}>🍓</span>
          </div>

          {/* Cake Tier 3 (Bottom Tier) */}
          <div
            style={{
              width: "370px",
              height: "75px",
              background: "linear-gradient(180deg, #FFC2D4 0%, #FF8FA3 100%)",
              borderRadius: "20px 20px 10px 10px",
              marginTop: "-4px",
              position: "relative",
              boxShadow: "inset 0 4px 12px rgba(255,255,255,0.7), 0 8px 20px rgba(238,78,123,0.2)",
              border: "2px solid #FF7096",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1
            }}
          >
            {/* Frosting Shell Edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "18px",
                background: "#FFEAF0",
                borderRadius: "20px 20px 10px 10px"
              }}
            />
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "12px",
                fontSize: "1.1rem",
                color: "#FFFFFF",
                fontWeight: 600
              }}
            >
              <span>✨</span>
              <span>21 Years of Pure Grace</span>
              <span>✨</span>
            </div>
          </div>

          {/* Cake Pedestal / Plate */}
          <div
            style={{
              width: "420px",
              height: "18px",
              background: "linear-gradient(180deg, #FFFFFF 0%, #F5D0DD 100%)",
              borderRadius: "999px",
              marginTop: "-4px",
              boxShadow: "0 10px 25px rgba(216, 38, 91, 0.25)",
              border: "1.5px solid #FFB3C6"
            }}
          />
        </div>

        {/* Cake Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {activeCount > 0 ? (
            <button
              onClick={blowAllCandles}
              className="btn-cute-primary"
              id="blow-all-candles-btn"
            >
              <Flame size={18} />
              <span className="label-long">Make a Wish & Blow All Candles! 🕯️✨</span>
              <span className="label-short">Blow All Candles! 🕯️✨</span>
            </button>
          ) : (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => {
                  sounds.playSparkle();
                  triggerConfettiCelebration();
                  setShowWishModal(true);
                }}
                className="btn-cute-primary"
              >
                <Sparkles size={18} />
                <span>Celebrate Wish Again 🎉</span>
              </button>

              <button
                onClick={relightCandles}
                className="btn-cute-secondary"
              >
                <RotateCcw size={16} />
                <span>Relight 21 Candles</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wish Granted Modal */}
      {showWishModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(74, 46, 53, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))",
            overscrollBehavior: "contain"
          }}
          onClick={() => setShowWishModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: "500px",
              width: "100%",
              maxHeight: "88dvh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: "clamp(26px, 6vw, 36px) clamp(18px, 5vw, 24px)",
              textAlign: "center",
              background: "#FFFFFF",
              borderRadius: "28px",
              boxShadow: "0 20px 50px rgba(216, 38, 91, 0.35)",
              border: "2px solid #FFAFCC",
              animation: "gentleFloat 4s ease-in-out infinite"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFE1EB, #FFC2D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                boxShadow: "0 8px 20px rgba(238, 78, 123, 0.25)"
              }}
            >
              <Heart size={36} color="#EE4E7B" fill="#EE4E7B" />
            </div>

            <h3
              className="font-playfair"
              style={{
                fontSize: "clamp(1.45rem, 6vw, 1.9rem)",
                color: "var(--color-pink-700)",
                marginBottom: "10px"
              }}
            >
              Happy 21st Birthday, Eraj! 🌸
            </h3>

            <p
              style={{
                fontSize: "clamp(0.96rem, 3.8vw, 1.05rem)",
                color: "var(--color-text-main)",
                lineHeight: 1.6,
                marginBottom: "24px"
              }}
            >
              Your 21 candles are blown and your wish has been granted! ✨ May this milestone year shower you with immense joy, peace of mind, genuine laughter, and every dream you hold close to your heart.
            </p>

            <button
              onClick={() => {
                sounds.playPop(600);
                setShowWishModal(false);
              }}
              className="btn-cute-primary"
              style={{ width: "100%" }}
            >
              <span>Thank You! Keep Celebrating 💖</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
