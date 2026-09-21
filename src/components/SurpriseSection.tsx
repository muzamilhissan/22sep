"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Gift, Mail, Heart, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { BIRTHDAY_DATA } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";

export default function SurpriseSection() {
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"letter" | "reasons" | "scratch">("letter");
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [currentReasonIdx, setCurrentReasonIdx] = useState(0);

  // Scratch card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);
  const isScratching = useRef(false);
  const lastScratchPoint = useRef<{ x: number; y: number } | null>(null);
  const lastProgressCheck = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const handleOpenGiftBox = () => {
    sounds.playGiftUnwrap();
    setIsBoxOpened(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FF7096", "#FFB3C6", "#FFE1EB", "#F3C969"]
    });
  };

  const handleOpenEnvelope = () => {
    sounds.playSparkle();
    setIsEnvelopeOpen(true);
  };

  // Scratch Card Canvas Logic
  const initScratchCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw glamorous pink glitter scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#FF8FA3");
    gradient.addColorStop(0.5, "#FFB3C6");
    gradient.addColorStop(1, "#FF7096");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Sparkle speckles
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text on scratch surface
    ctx.font = "bold 16px 'Outfit', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("✨ Scratch with your finger ✨", width / 2, height / 2);
  }, []);

  useEffect(() => {
    if (!(isBoxOpened && activeTab === "scratch" && !isScratchRevealed)) return;
    const timer = setTimeout(initScratchCanvas, 100);

    // Redraw the overlay when the card is resized (e.g. phone rotation) so it never stretches
    let lastWidth = 0;
    const observer = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (lastWidth && w !== lastWidth) initScratchCanvas();
      lastWidth = w;
    });
    if (canvasRef.current) observer.observe(canvasRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isBoxOpened, activeTab, isScratchRevealed, initScratchCanvas]);

  const scratch = (clientX: number, clientY: number, timeStamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Draw a thick stroke from the previous point so fast finger swipes leave no gaps
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 48;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const from = lastScratchPoint.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastScratchPoint.current = { x, y };

    // Sound effect occasional
    if (Math.random() > 0.85) {
      sounds.playPop(800 + Math.random() * 400);
    }

    // Reading pixels is expensive on phones, so only check progress a few times per second
    if (timeStamp - lastProgressCheck.current > 120) {
      lastProgressCheck.current = timeStamp;
      checkScratchProgress();
    }
  };

  const endScratch = () => {
    isScratching.current = false;
    lastScratchPoint.current = null;
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;
      for (let i = 3; i < imgData.data.length; i += 16) {
        if (imgData.data[i] === 0) cleared++;
      }
      const progress = (cleared / (imgData.data.length / 16)) * 100;
      setScratchProgress(progress);

      if (progress > 45 && !isScratchRevealed) {
        setIsScratchRevealed(true);
        sounds.playSparkle();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF7096", "#F3C969", "#FFFFFF"]
        });
      }
    } catch {
      // ignore
    }
  };

  const nextReason = () => {
    sounds.playPop(650);
    setCurrentReasonIdx((prev) => (prev + 1) % BIRTHDAY_DATA.reasons.length);
  };

  const prevReason = () => {
    sounds.playPop(550);
    setCurrentReasonIdx((prev) => (prev - 1 + BIRTHDAY_DATA.reasons.length) % BIRTHDAY_DATA.reasons.length);
  };

  return (
    <section
      id="surprise-section"
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
          maxWidth: "920px",
          padding: "50px 30px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
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
          <Gift size={14} />
          <span>A Special Birthday Surprise</span>
        </div>

        <h2
          className="font-playfair"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--color-pink-700)",
            marginBottom: "10px"
          }}
        >
          A Birthday Surprise for Eraj 🎁
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-muted)",
            maxWidth: "520px",
            marginBottom: "32px"
          }}
        >
          {isBoxOpened
            ? "Your surprise box is open! Explore your heartfelt letter, 21 sweet reasons, and secret wish below."
            : "A hand-tied birthday package with love, warm wishes, and charming surprises waiting inside!"}
        </p>

        {/* Gift Box Closed State */}
        {!isBoxOpened ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              padding: "20px 0"
            }}
          >
            {/* 3D-styled Pink Gift Box Illustration */}
            <div
              onClick={handleOpenGiftBox}
              role="button"
              tabIndex={0}
              aria-label="Open the gift box"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenGiftBox();
                }
              }}
              className="animate-float"
              style={{
                cursor: "pointer",
                width: "200px",
                height: "200px",
                position: "relative",
                transition: "transform 0.3s ease"
              }}
              title="Tap to open!"
            >
              {/* Box Base */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "20px",
                  width: "160px",
                  height: "120px",
                  background: "linear-gradient(135deg, #FF8FA3 0%, #EE4E7B 100%)",
                  borderRadius: "14px",
                  boxShadow: "0 18px 35px rgba(238, 78, 123, 0.35)",
                  border: "2px solid #FFAFCC"
                }}
              >
                {/* Vertical Ribbon */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "28px",
                    background: "linear-gradient(90deg, #F3C969 0%, #FFF4CC 50%, #F3C969 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                />
              </div>

              {/* Box Lid */}
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  left: "10px",
                  width: "180px",
                  height: "40px",
                  background: "linear-gradient(135deg, #FFB3C6 0%, #FF7096 100%)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(238, 78, 123, 0.25)",
                  border: "2px solid #FFF",
                  zIndex: 2
                }}
              >
                {/* Horizontal Ribbon */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "28px",
                    background: "linear-gradient(90deg, #F3C969 0%, #FFF4CC 50%, #F3C969 100%)"
                  }}
                />
              </div>

              {/* Ribbon Bow */}
              <div
                style={{
                  position: "absolute",
                  top: "22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "4px",
                  zIndex: 3
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50% 50% 10% 50%",
                    background: "#F3C969",
                    border: "2px solid #FFF",
                    transform: "rotate(-25deg)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                />
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50% 50% 50% 10%",
                    background: "#F3C969",
                    border: "2px solid #FFF",
                    transform: "rotate(25deg)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleOpenGiftBox}
              className="btn-cute-primary"
              id="open-surprise-btn"
            >
              <Sparkles size={18} />
              <span>Open Your Surprise 🎁</span>
            </button>
          </div>
        ) : (
          /* Opened Surprise Hub */
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Surprise Tabs */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.85)",
                padding: "5px",
                borderRadius: "999px",
                border: "1px solid var(--color-pink-200)",
                marginBottom: "32px",
                flexWrap: "nowrap",
                justifyContent: "center",
                width: "100%",
                maxWidth: "460px"
              }}
            >
              <button
                onClick={() => {
                  sounds.playPop(550);
                  setActiveTab("letter");
                }}
                style={{
                  flex: "1 1 auto",
                  padding: "10px clamp(6px, 2.5vw, 14px)",
                  minHeight: "42px",
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  border: "none",
                  background: activeTab === "letter" ? "var(--color-pink-500)" : "transparent",
                  color: activeTab === "letter" ? "#FFF" : "var(--color-text-main)",
                  fontWeight: 600,
                  fontSize: "clamp(0.8rem, 3.4vw, 0.85rem)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.25s ease"
                }}
              >
                <Mail size={15} className="tab-icon" />
                <span>Letter</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop(650);
                  setActiveTab("reasons");
                }}
                style={{
                  flex: "1 1 auto",
                  padding: "10px clamp(6px, 2.5vw, 14px)",
                  minHeight: "42px",
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  border: "none",
                  background: activeTab === "reasons" ? "var(--color-pink-500)" : "transparent",
                  color: activeTab === "reasons" ? "#FFF" : "var(--color-text-main)",
                  fontWeight: 600,
                  fontSize: "clamp(0.8rem, 3.4vw, 0.85rem)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.25s ease"
                }}
              >
                <Heart size={15} className="tab-icon" />
                <span>21 Reasons</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop(750);
                  setActiveTab("scratch");
                }}
                style={{
                  flex: "1 1 auto",
                  padding: "10px clamp(6px, 2.5vw, 14px)",
                  minHeight: "42px",
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  border: "none",
                  background: activeTab === "scratch" ? "var(--color-pink-500)" : "transparent",
                  color: activeTab === "scratch" ? "#FFF" : "var(--color-text-main)",
                  fontWeight: 600,
                  fontSize: "clamp(0.8rem, 3.4vw, 0.85rem)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.25s ease"
                }}
              >
                <Sparkles size={15} className="tab-icon" />
                <span>Secret Wish</span>
              </button>
            </div>

            {/* TAB 1: Wax-Sealed Birthday Letter */}
            {activeTab === "letter" && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "680px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {!isEnvelopeOpen ? (
                  <div
                    onClick={handleOpenEnvelope}
                    role="button"
                    tabIndex={0}
                    aria-label="Open the birthday letter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenEnvelope();
                      }
                    }}
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      height: "210px",
                      background: "linear-gradient(135deg, #FFE1EB 0%, #FFC2D4 100%)",
                      borderRadius: "16px",
                      border: "2px solid #FFAFCC",
                      boxShadow: "0 15px 35px rgba(238, 78, 123, 0.25)",
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.3s ease"
                    }}
                    title="Tap to break seal & open letter"
                  >
                    {/* Envelope Flap Lines */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100px",
                        borderBottom: "2px solid rgba(255, 112, 150, 0.3)",
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        background: "linear-gradient(180deg, #FFF0F4 0%, #FFE1EB 100%)"
                      }}
                    />

                    {/* Gold Wax Seal Stamp */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 30% 30%, #FCE8B3, #D4AF37, #AA820A)",
                        boxShadow: "0 4px 15px rgba(212, 175, 55, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFF",
                        fontWeight: 700,
                        fontSize: "1.4rem",
                        fontFamily: "var(--font-playfair)",
                        zIndex: 10,
                        border: "2px dashed rgba(255, 255, 255, 0.5)"
                      }}
                    >
                      E
                    </div>

                    <span
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        fontSize: "0.85rem",
                        color: "var(--color-pink-700)",
                        fontWeight: 600
                      }}
                    >
                      Tap the Wax Seal to Open 💌
                    </span>
                  </div>
                ) : (
                  /* The Opened Letter */
                  <div
                    style={{
                      width: "100%",
                      background: "#FFFBF7",
                      padding: "clamp(26px, 6vw, 45px) clamp(18px, 5vw, 35px)",
                      borderRadius: "16px",
                      border: "1.5px solid #FFCCD5",
                      boxShadow: "0 15px 40px rgba(238, 78, 123, 0.15)",
                      textAlign: "left",
                      position: "relative"
                    }}
                  >
                    {/* Pressed Flower Corner Sticker */}
                    <div style={{ position: "absolute", top: "14px", right: "16px", fontSize: "clamp(1.4rem, 5vw, 1.8rem)" }}>
                      🌸
                    </div>

                    <p
                      className="font-playfair"
                      style={{
                        fontSize: "clamp(1.2rem, 4.6vw, 1.4rem)",
                        color: "var(--color-pink-700)",
                        marginBottom: "12px",
                        paddingRight: "36px",
                        fontWeight: 600
                      }}
                    >
                      {BIRTHDAY_DATA.letter.salutation}
                    </p>

                    <p
                      className="font-script"
                      style={{
                        fontSize: "clamp(1.45rem, 6vw, 1.8rem)",
                        color: "var(--color-pink-500)",
                        marginBottom: "20px"
                      }}
                    >
                      {BIRTHDAY_DATA.letter.opening}
                    </p>

                    {BIRTHDAY_DATA.letter.paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: "clamp(0.98rem, 3.8vw, 1.05rem)",
                          color: "var(--color-text-main)",
                          lineHeight: 1.75,
                          marginBottom: "18px"
                        }}
                      >
                        {p}
                      </p>
                    ))}

                    <p
                      style={{
                        fontSize: "1.05rem",
                        color: "var(--color-text-muted)",
                        marginTop: "24px"
                      }}
                    >
                      {BIRTHDAY_DATA.letter.closing}
                    </p>

                    <p
                      className="font-handwriting"
                      style={{
                        fontSize: "1.9rem",
                        color: "var(--color-pink-600)",
                        marginTop: "6px"
                      }}
                    >
                      {BIRTHDAY_DATA.letter.signature}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 21 Reasons Carousel */}
            {activeTab === "reasons" && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <div
                  onPointerDown={(e) => {
                    swipeStart.current = { x: e.clientX, y: e.clientY };
                  }}
                  onPointerUp={(e) => {
                    const start = swipeStart.current;
                    swipeStart.current = null;
                    if (!start) return;
                    const dx = e.clientX - start.x;
                    const dy = e.clientY - start.y;
                    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                      if (dx < 0) nextReason();
                      else prevReason();
                    }
                  }}
                  onPointerCancel={() => (swipeStart.current = null)}
                  style={{
                    touchAction: "pan-y",
                    userSelect: "none",
                    width: "100%",
                    minHeight: "260px",
                    background: "linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 100%)",
                    border: "2px solid #FFC2D4",
                    borderRadius: "24px",
                    padding: "clamp(52px, 10vw, 56px) clamp(18px, 5vw, 30px) clamp(28px, 6vw, 36px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 30px rgba(238, 78, 123, 0.12)",
                    position: "relative"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--color-pink-500)",
                      background: "rgba(255, 225, 235, 0.8)",
                      padding: "3px 10px",
                      borderRadius: "999px"
                    }}
                  >
                    Reason #{BIRTHDAY_DATA.reasons[currentReasonIdx].id} of 21
                  </span>

                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
                    {BIRTHDAY_DATA.reasons[currentReasonIdx].emoji}
                  </div>

                  <h3
                    className="font-playfair"
                    style={{
                      fontSize: "clamp(1.25rem, 5vw, 1.5rem)",
                      color: "var(--color-pink-700)",
                      marginBottom: "10px"
                    }}
                  >
                    {BIRTHDAY_DATA.reasons[currentReasonIdx].title}
                  </h3>

                  <p
                    style={{
                      fontSize: "clamp(0.96rem, 3.8vw, 1.05rem)",
                      color: "var(--color-text-main)",
                      lineHeight: 1.6,
                      maxWidth: "440px"
                    }}
                  >
                    {BIRTHDAY_DATA.reasons[currentReasonIdx].description}
                  </p>
                </div>

                {/* Carousel Controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(8px, 3vw, 16px)",
                    marginTop: "20px",
                    width: "100%"
                  }}
                >
                  <button
                    onClick={prevReason}
                    className="btn-cute-secondary"
                    style={{ padding: "8px 14px" }}
                    aria-label="Previous reason"
                  >
                    <ChevronLeft size={18} />
                    <span className="label-long">Previous</span>
                  </button>

                  <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {currentReasonIdx + 1} / {BIRTHDAY_DATA.reasons.length}
                  </span>

                  <button
                    onClick={nextReason}
                    className="btn-cute-primary"
                    style={{ padding: "8px 18px" }}
                    aria-label="Next reason"
                  >
                    <span className="label-long">Next Reason</span>
                    <span className="label-short">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Scratch-Off Secret Wish */}
            {activeTab === "scratch" && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--color-pink-600)",
                    marginBottom: "16px",
                    fontWeight: 600
                  }}
                >
                  {BIRTHDAY_DATA.scratchWish.hint}
                </p>

                <div
                  style={{
                    width: "100%",
                    height: "220px",
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "2px solid #FF8FA3",
                    boxShadow: "0 10px 30px rgba(238, 78, 123, 0.2)"
                  }}
                >
                  {/* Hidden Message Layer Underneath */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, #FFF0F4 0%, #FFE1EB 100%)",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >
                    <Heart size={28} color="#EE4E7B" fill="#EE4E7B" style={{ marginBottom: "8px" }} />
                    <p
                      style={{
                        fontSize: "1.05rem",
                        color: "var(--color-pink-700)",
                        lineHeight: 1.6,
                        fontWeight: 500
                      }}
                    >
                      {BIRTHDAY_DATA.scratchWish.revealedMessage}
                    </p>
                  </div>

                  {/* Scratchable Canvas Surface */}
                  {!isScratchRevealed && (
                    <canvas
                      ref={canvasRef}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "crosshair",
                        touchAction: "none"
                      }}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        isScratching.current = true;
                        lastScratchPoint.current = null;
                        scratch(e.clientX, e.clientY, e.timeStamp);
                      }}
                      onPointerMove={(e) => {
                        if (isScratching.current) scratch(e.clientX, e.clientY, e.timeStamp);
                      }}
                      onPointerUp={endScratch}
                      onPointerCancel={endScratch}
                    />
                  )}
                </div>

                {isScratchRevealed && (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--color-pink-600)",
                      fontWeight: 600,
                      fontSize: "0.9rem"
                    }}
                  >
                    <Check size={16} />
                    <span>Secret Wish Revealed! May it come true! ✨</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
