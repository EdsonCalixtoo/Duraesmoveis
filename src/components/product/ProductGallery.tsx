'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImageItem } from '@/types';

interface ProductGalleryProps {
  images: ProductImageItem[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fallbackImages = [
    {
      id: '1',
      productId: '1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      alt: productName,
      displayOrder: 1,
      isCover: true,
    },
    {
      id: '2',
      productId: '1',
      url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
      alt: `${productName} - Trama Náutica`,
      displayOrder: 2,
      isCover: false,
    },
    {
      id: '3',
      productId: '1',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      alt: `${productName} - Almofadas`,
      displayOrder: 3,
      isCover: false,
    },
    {
      id: '4',
      productId: '1',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      alt: `${productName} - Ambiente`,
      displayOrder: 4,
      isCover: false,
    },
  ];

  const galleryImages = images && images.length > 0 ? images : fallbackImages;
  const currentImage = galleryImages[selectedIdx] || galleryImages[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails strip (vertical on desktop, horizontal on mobile) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 flex-shrink-0">
        {galleryImages.map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#161616] border-2 transition-all flex-shrink-0 ${
              selectedIdx === idx
                ? 'border-[#8CF000] shadow-lime-sm scale-105'
                : 'border-[#2B2B2B] hover:border-[#404040] opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || productName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Large Image */}
      <div className="relative flex-1 aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#141414] border border-[#2B2B2B]">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
