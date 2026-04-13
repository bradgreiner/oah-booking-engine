"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoGallery from "@/components/PhotoGallery";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";

interface PhotoGridProps {
  images: { url: string; alt?: string | null; sortOrder?: number }[];
  propertyName: string;
}

export default function PhotoGrid({ images, propertyName }: PhotoGridProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  function openGallery(idx: number) {
    setGalleryIndex(idx);
    setGalleryOpen(true);
  }

  return (
    <>
      <div className="mx-auto max-w-7xl md:px-4 md:pt-6">
        <div className="grid h-[250px] grid-cols-1 gap-2 overflow-hidden md:h-[420px] md:grid-cols-4 md:grid-rows-2 md:rounded-xl">
          <div className="relative col-span-1 row-span-2 bg-gray-100 md:col-span-2">
            {images[0] ? (
              <Image
                src={images[0].url}
                alt={propertyName}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="cursor-pointer object-cover"
                priority
                onClick={() => openGallery(0)}
              />
            ) : (
              <PhotoPlaceholder size="lg" />
            )}
            {/* Mobile "View all photos" button */}
            {images.length > 1 && (
              <button
                onClick={() => openGallery(0)}
                className="absolute bottom-4 left-4 cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm md:hidden"
              >
                View all photos ({images.length})
              </button>
            )}
            {/* Desktop "View all photos" button */}
            {images.length > 5 && (
              <button
                onClick={() => openGallery(0)}
                className="absolute bottom-4 left-4 hidden cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm md:block"
              >
                View all photos ({images.length})
              </button>
            )}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative hidden bg-gray-100 md:block">
              {images[i] ? (
                <Image
                  src={images[i].url}
                  alt={`${propertyName} ${i + 1}`}
                  fill
                  sizes="20vw"
                  className="cursor-pointer object-cover"
                  onClick={() => openGallery(i)}
                />
              ) : (
                <PhotoPlaceholder size="sm" />
              )}
            </div>
          ))}
        </div>
      </div>

      {galleryOpen && (
        <PhotoGallery
          images={images}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}
