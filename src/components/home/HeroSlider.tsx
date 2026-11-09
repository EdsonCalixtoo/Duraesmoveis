'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    titlePrefix: 'Transforme seu espaço externo em um ambiente',
    highlight: 'incrível!',
    subtitle: 'Móveis externos com design moderno, qualidade premium e conforto incomparável.',
    buttonText: 'Ver Coleção Completa',
    buttonLink: '/catalogo',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 2,
    titlePrefix: 'Coleção Riviera 2026: Sofisticação em',
    highlight: 'Corda Náutica',
    subtitle: 'Alumínio naval nobre, tecidos 100% repelentes à água e garantia contra maresia.',
    buttonText: 'Explorar Linha Náutica',
    buttonLink: '/categoria/sofas-externos',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1920&q=85',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-black">
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0">
        <Image
          src={slide.imageUrl}
          alt={slide.highlight}
          fill
          priority
          className="object-cover object-center transition-all duration-1000 scale-105"
          sizes="100vw"
        />
        {/* Radial & Linear gradient for atmospheric depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 flex flex-col justify-center z-10">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C]/80 border border-[#303030] text-xs font-medium text-white backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#8CF000] animate-pulse" />
            <span>Coleção Exclusiva Outdoor 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            {slide.titlePrefix}{' '}
            <span className="text-[#8CF000] drop-shadow-md">{slide.highlight}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#C2C2C2] max-w-xl font-normal leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              href={slide.buttonLink}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-sm md:text-base transition-all transform hover:scale-[1.02] shadow-lime-glow"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 border border-[#303030] hover:border-[#8CF000] text-white hover:text-[#8CF000] flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 border border-[#303030] hover:border-[#8CF000] text-white hover:text-[#8CF000] flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir para slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              current === idx ? 'w-8 bg-[#8CF000]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
