"use client";

import React, { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  swayRadius: number;
  swaySpeed: number;
  swayAngle: number;
}

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect users who have asked their device to minimise motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      // Mobile browsers fire resize when the URL bar shows/hides; only the width really matters
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 150) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const colors = [
      "rgba(255, 182, 193, 0.75)", // Light pink
      "rgba(255, 192, 203, 0.65)", // Pink
      "rgba(255, 220, 230, 0.7)",  // Soft blush
      "rgba(255, 160, 185, 0.7)",  // Cherry petal
      "rgba(255, 240, 245, 0.8)",  // Lavender blush
      "rgba(253, 203, 218, 0.65)"  // Rose petal
    ];

    // Fewer petals on small screens keeps phones smooth and the content readable
    const petalCount = Math.max(8, Math.min(32, Math.floor(width / (width < 640 ? 45 : 35))));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 10, // 10 to 20px
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 1.2 + 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        swayRadius: Math.random() * 25 + 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2
      });
    }

    // Mouse interaction
    let mouseX = -100;
    let mouseY = -100;
    // Pointer interaction (mouse hover or finger drag)
    const handleMouseMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handlePointerEnd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        mouseX = -100;
        mouseY = -100;
      }
    };
    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Draw elegant curved petal path
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.7, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fill();

      // Delicate inner petal vein
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(0, p.size * 0.6);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.swayAngle) * 0.7;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Subtle wind puff on mouse hover
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          p.x += (dx / dist) * 2;
          p.y += (dy / dist) * 2;
        }

        // Loop petals to top
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2
      }}
      aria-hidden="true"
    />
  );
}
