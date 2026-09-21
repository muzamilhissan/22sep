"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Lock } from "lucide-react";
import { getTimeRemaining, TimeRemaining } from "@/utils/countdown";
import { BIRTHDAY_DATA } from "@/data/birthdayData";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false,
    totalSeconds: 0
  });

  useEffect(() => {
    // Initial check
    const current = getTimeRemaining(BIRTHDAY_DATA.targetUnlockDate);
    setTimeLeft(current);
    if (current.isUnlocked) {
      onUnlock();
    }

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(BIRTHDAY_DATA.targetUnlockDate);
      setTimeLeft(remaining);
      if (remaining.isUnlocked) {
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onUnlock]);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 5vw, 30px) 14px",
        textAlign: "center",
        position: "relative"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "680px",
          padding: "50px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative"
        }}
      >
        {/* Animated Floral Lock Icon */}
        <div
          aria-hidden="true"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FFE1EB 0%, #FFC2D4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 10px 25px rgba(238, 78, 123, 0.2)",
            border: "2px solid #FFAFCC"
          }}
        >
          <Lock size={36} color="#EE4E7B" />
        </div>

        {/* Milestone Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 225, 235, 0.8)",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "clamp(0.76rem, 3.3vw, 0.85rem)",
            fontWeight: 600,
            color: "var(--color-pink-600)",
            marginBottom: "16px"
          }}
        >
          <Sparkles size={14} />
          <span>Eraj is Turning 21 on 22 September!</span>
        </div>

        {/* Main Lock Heading */}
        <h1
          className="font-playfair"
          style={{
            fontSize: "clamp(1.8rem, 7.5vw, 3.4rem)",
            color: "var(--color-pink-700)",
            lineHeight: 1.2,
            marginBottom: "14px"
          }}
        >
          Something Magical is Blooming... 🌸
        </h1>

        <p
          style={{
            fontSize: "clamp(0.96rem, 3.8vw, 1.05rem)",
            color: "var(--color-text-muted)",
            maxWidth: "480px",
            marginBottom: "36px",
            lineHeight: 1.6
          }}
        >
          A special 21st birthday celebration made with love for <strong>Eraj</strong>. The site will automatically unlock when the clock strikes midnight on <strong>22 September</strong>! 💖
        </p>

        {/* Countdown Timer Units */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "clamp(8px, 2.5vw, 14px)",
            width: "100%",
            maxWidth: "420px"
          }}
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "clamp(12px, 3vw, 16px) 2px",
                minWidth: 0,
                background: "linear-gradient(180deg, #FFFFFF 0%, #FFF0F4 100%)",
                border: "2px solid #FFCCD5",
                borderRadius: "18px",
                boxShadow: "0 8px 20px rgba(238, 78, 123, 0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
                  fontWeight: 700,
                  color: "var(--color-pink-600)",
                  fontFamily: "var(--font-outfit)",
                  lineHeight: 1
                }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "clamp(0.65rem, 2vw, 0.75rem)",
                  textTransform: "uppercase",
                  letterSpacing: "clamp(0px, 0.3vw, 1px)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  marginTop: "6px"
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
