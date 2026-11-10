'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImageItem } from '@/types';

interface ProductGalleryProps {
  images?: ProductImageItem[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fallbackImages = [
    {
      id: '1',
      productId: '1',
      url: '/images/prod-sofa-riviera.jpg',
      alt: productName,
      displayOrder: 1,
      isCover: true,
    },
    {
      id: '2',
      productId: '1',
      url: '/images/hero-outdoor-luxury.jpg',
      alt: `${productName} - Vista Noturna Deck`,
      displayOrder: 2,
      isCover: false,
    },
    {
      id: '3',
      productId: '1',
      url: '/images/cat-sofas-externos.jpg',
      alt: `${productName} - Trama Náutica`,
      displayOrder: 3,
      isCover: false,
    },
    {
      id: '4',
      productId: '1',
      url: '/images/prod-sofa-3-lugares.jpg',
      alt: `${productName} - Almofadas`,
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
          <motion.button
            key={img.id || idx}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#161616] border-2 transition-all flex-shrink-0 ${
              selectedIdx === idx
                ? 'border-[#8CF000] shadow-[0_0_12px_rgba(140,240,0,0.4)] scale-105'
                : 'border-[#2B2B2B] hover:border-[#505050] opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || productName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </motion.button>
        ))}
      </div>

      {/* Main Large Image with crossfade transition */}
      <div className="relative flex-1 aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#141414] border border-[#2B2B2B]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.url}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full relative"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || productName}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
