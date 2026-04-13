"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  images: { url: string; alt?: string | null; sortOrder?: number }[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoGallery({ images, initialIndex, onClose }: PhotoGalleryProps) {
  const [index, setIndex] = useState(initialIndex);
  const [opacity, setOpacity] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= images.length) return;
      setOpacity(0);
      setTimeout(() => {
        setIndex(next);
        setOpacity(1);
      }, 150);
    },
    [images.length]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  // Preload adjacent images
  useEffect(() => {
    if (images[index + 1]?.url) {
      const img = new window.Image();
      img.src = images[index + 1].url;
    }
    if (images[index - 1]?.url) {
      const img = new window.Image();
      img.src = images[index - 1].url;
    }
  }, [index, images]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) {
      onClose();
    }
  }

  const current = images[index];
  if (!current) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
    >
      {/* Counter top-left */}
      <span className="absolute left-4 top-4 text-sm text-white/70">
        {index + 1} / {images.length}
      </span>

      {/* Close button top-right */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-white/10 p-2 transition hover:bg-white/20"
        aria-label="Close gallery"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Left arrow */}
      {index > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Previous photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {index < images.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Next photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Image + caption */}
      <div
        className="flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="transition-opacity duration-200"
          style={{ opacity }}
        >
          <Image
            src={current.url}
            alt={current.alt || `Photo ${index + 1}`}
            width={1200}
            height={800}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            priority
          />
        </div>
        {current.alt && (
          <p className="mt-3 text-center text-sm text-white/60">{current.alt}</p>
        )}
      </div>
    </div>
  );
}
