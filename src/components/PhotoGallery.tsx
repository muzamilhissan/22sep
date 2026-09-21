"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Heart, X } from "lucide-react";
import { BIRTHDAY_DATA, PhotoItem } from "@/data/birthdayData";
import { sounds } from "@/utils/soundEffects";

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    BIRTHDAY_DATA.photos.forEach((p) => {
      initial[p.id] = p.likes;
    });
    return initial;
  });

  // Lock background scroll + allow Escape to close while the lightbox is open
  useEffect(() => {
    if (!selectedPhoto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPhoto]);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playPop(750);
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handlePhotoClick = (photo: PhotoItem) => {
    sounds.playSparkle();
    setSelectedPhoto(photo);
  };

  return (
    <section
      id="gallery-section"
      className="section-pad"
      style={{
        padding: "80px 20px 100px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Badge */}
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
          <Camera size={14} />
          <span>Cherished Moments • Polaroid Wall</span>
        </div>

        <h2
          className="font-playfair"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--color-pink-700)",
            marginBottom: "10px"
          }}
        >
          Moments of Grace & Joy 📸
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-muted)",
            maxWidth: "520px",
            marginBottom: "36px"
          }}
        >
          A curated collection of dreamy memories, celebrating 21 years of radiant beauty and unforgettable moments.
        </p>

        {/* Polaroid Grid */}
        <div className="polaroid-grid">
          {BIRTHDAY_DATA.photos.map((photo, index) => {
            // Slight alternate rotation for organic polaroid scrapbook feel
            const rotation = index % 3 === 0 ? "-1.5deg" : index % 3 === 1 ? "1.5deg" : "-0.5deg";

            return (
              <div
                key={photo.id}
                className="polaroid-card"
                onClick={() => handlePhotoClick(photo)}
                role="button"
                tabIndex={0}
                aria-label={`Open photo: ${photo.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePhotoClick(photo);
                  }
                }}
                style={{
                  transform: `rotate(${rotation})`,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Washi Tape Header */}
                <div
                  className="washi-tape"
                  style={{
                    background:
                      index % 2 === 0
                        ? "rgba(255, 182, 193, 0.85)"
                        : "rgba(255, 218, 185, 0.85)"
                  }}
                />

                {/* Optimized Image Wrapper */}
                <div
                  style={{
                    width: "100%",
                    height: "clamp(220px, 70vw, 260px)",
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#FCE8EE",
                    marginBottom: "14px"
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    placeholder={photo.blurDataURL ? "blur" : "empty"}
                    blurDataURL={photo.blurDataURL}
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                  />
                  {/* Tag Pill */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(4px)",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--color-pink-600)"
                    }}
                  >
                    {photo.tag}
                  </span>
                </div>

                {/* Polaroid Caption Area */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                    textAlign: "left"
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3
                      className="font-playfair"
                      style={{
                        fontSize: "1.15rem",
                        color: "var(--color-pink-700)",
                        marginBottom: "4px",
                        fontWeight: 600
                      }}
                    >
                      {photo.title}
                    </h3>
                    <p
                      className="font-handwriting"
                      style={{
                        fontSize: "1.1rem",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.3
                      }}
                    >
                      {photo.caption}
                    </p>
                  </div>

                  {/* Heart reaction button */}
                  <button
                    onClick={(e) => handleLike(e, photo.id)}
                    aria-label="Send love"
                    style={{
                      background: "rgba(255, 225, 235, 0.6)",
                      border: "none",
                      borderRadius: "999px",
                      padding: "8px 12px",
                      minHeight: "36px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                      color: "var(--color-pink-500)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Heart size={14} fill="currentColor" />
                    <span>{likes[photo.id]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(30, 15, 20, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
            padding: "max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))",
            overscrollBehavior: "contain"
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "14px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "92dvh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.92)",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            >
              <X size={20} color="#4A2E35" />
            </button>

            {/* Modal Image */}
            <div
              style={{
                width: "100%",
                height: "clamp(220px, 50dvh, 420px)",
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                marginBottom: "16px"
              }}
            >
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 680px"
                placeholder={selectedPhoto.blurDataURL ? "blur" : "empty"}
                blurDataURL={selectedPhoto.blurDataURL}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Modal Details */}
            <div style={{ padding: "0 10px 10px 10px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                <h3
                  className="font-playfair"
                  style={{
                    fontSize: "clamp(1.3rem, 5vw, 1.6rem)",
                    color: "var(--color-pink-700)"
                  }}
                >
                  {selectedPhoto.title}
                </h3>
                <span
                  style={{
                    background: "var(--color-pink-100)",
                    color: "var(--color-pink-600)",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}
                >
                  {selectedPhoto.tag}
                </span>
              </div>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--color-text-main)",
                  lineHeight: 1.6
                }}
              >
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
