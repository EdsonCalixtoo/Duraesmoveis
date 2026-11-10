'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface HeroSlide {
  id: number;
  tag: string;
  titlePrefix: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  objectPositionMobile: string;
  objectPositionDesktop: string;
  features: { icon: typeof ShieldCheck; text: string; shortText: string }[];
}

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: 'Coleção Exclusiva Outdoor 2026',
    titlePrefix: 'Transforme seu espaço externo em um ambiente',
    highlight: 'incrível!',
    subtitle:
      'Móveis externos com design moderno, qualidade premium e conforto incomparável para transformar sua varanda, jardim ou piscina.',
    buttonText: 'Ver Coleção Completa',
    buttonLink: '/catalogo',
    imageUrl: '/images/hero-outdoor-luxury-uhd.jpg',
    objectPositionMobile: 'center 75%',
    objectPositionDesktop: 'center center',
    features: [
      { icon: ShieldCheck, text: '5 Anos de Garantia', shortText: '5 Anos Garantia' },
      { icon: Sun, text: 'Alumínio Naval Nobre', shortText: 'Alumínio Naval' },
      { icon: Sparkles, text: 'Tecidos 100% Impermeáveis', shortText: '100% Impermeável' },
    ],
  },
  {
    id: 2,
    tag: 'Coleção Riviera 2026',
    titlePrefix: 'Sofisticação e Durabilidade em',
    highlight: 'Corda Náutica',
    subtitle:
      'Estruturas artesanais em corda náutica com proteção UV ultra-resistente contra sol intenso, chuva e maresia.',
    buttonText: 'Explorar Linha Náutica',
    buttonLink: '/categoria/sofas-externos',
    imageUrl: '/images/hero-resort-deck-uhd.jpg',
    objectPositionMobile: 'center 65%',
    objectPositionDesktop: 'center center',
    features: [
      { icon: ShieldCheck, text: 'Garantia Anti-Maresia', shortText: 'Anti-Maresia' },
      { icon: Sun, text: 'Proteção Solar UV50+', shortText: 'Proteção UV50+' },
      { icon: Sparkles, text: 'Espuma D33 Seca Rápido', shortText: 'Seca Rápido D33' },
    ],
  },
  {
    id: 3,
    tag: 'Área Gourmet & Varanda',
    titlePrefix: 'Crie Momentos Inesquecíveis com Nossas',
    highlight: 'Mesas e Cadeiras',
    subtitle:
      'Conjuntos de jantar contemporâneos em madeira teca e perfis de alumínio com pintura eletrostática de alta durabilidade.',
    buttonText: 'Ver Conjuntos de Jantar',
    buttonLink: '/categoria/mesas-e-cadeiras',
    imageUrl: '/images/hero-luxury-patio-uhd.jpg',
    objectPositionMobile: 'center 50%',
    objectPositionDesktop: 'center center',
    features: [
      { icon: ShieldCheck, text: 'Madeira Teca Certificada', shortText: 'Madeira Teca' },
      { icon: Sun, text: 'Pintura Eletrostática', shortText: 'Pintura Eletrostática' },
      { icon: Sparkles, text: 'Frete Seguro e Montagem', shortText: 'Frete Seguro' },
    ],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Touch Swipe tracking for Mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = SLIDES[current];

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      nextSlide(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Swiped right -> prev
    }
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques Principais"
      className="relative w-full bg-[#080808] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          1. VERSÃO MOBILE (< md): Limpa, Compacta, Imagem no Topo, Sem Sobreposições
          ========================================================================= */}
      <div
        className="block md:hidden w-full select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Topo Mobile: Imagem do Ambiente em Largura Total */}
        <div className="relative w-full aspect-[16/10] xs:aspect-[16/9] max-h-[300px] bg-black overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-img-${slide.id}`}
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={slide.imageUrl}
                alt={`${slide.titlePrefix} ${slide.highlight}`}
                fill
                priority
                quality={92}
                className="object-cover"
                style={{ objectPosition: slide.objectPositionMobile }}
                sizes="100vw"
              />

              {/* Degradê inferior suave conectando com o fundo preto */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Badge de Coleção no Topo Esquerdo da Imagem */}
          <div className="absolute top-3 left-3.5 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8CF000] shadow-[0_0_6px_#8CF000] animate-pulse" />
            <span className="tracking-wide uppercase text-[10px] text-[#E5E5E5]">{slide.tag}</span>
          </div>

          {/* Indicador de Swipe sutil no canto inferior direito */}
          <div className="absolute bottom-2.5 right-3.5 z-10 px-2 py-0.5 rounded-md bg-black/50 border border-white/10 text-[9px] font-mono text-zinc-400 backdrop-blur-sm pointer-events-none">
            0{current + 1} / 0{SLIDES.length}
          </div>
        </div>

        {/* Conteúdo Abaixo da Imagem sobre Fundo Preto Sólido */}
        <div className="w-full px-4 pt-3.5 pb-2 flex flex-col space-y-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-content-${slide.id}`}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              {/* Título com Tipografia Responsiva (28px a 34px) */}
              <h1 className="text-[28px] xs:text-[30px] sm:text-[34px] font-black text-white leading-[1.12] tracking-tight">
                {slide.titlePrefix}{' '}
                <span className="text-[#8CF000] drop-shadow-[0_2px_18px_rgba(140,240,0,0.45)]">
                  {slide.highlight}
                </span>
              </h1>

              {/* Subtítulo Conciso (máximo 3 linhas) */}
              <p className="line-clamp-3 text-xs sm:text-sm text-[#CCCCCC] font-normal leading-relaxed">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bloco de CTAs no Mobile */}
          <div className="space-y-2 pt-1">
            {/* CTA Principal de Largura Total */}
            <Link
              href={slide.buttonLink}
              className="w-full py-3.5 px-6 rounded-xl bg-[#8CF000] active:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(140,240,0,0.35)] transition-all"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* CTA Secundário Discreto */}
            <Link
              href="/contato"
              className="w-full py-1 text-center text-xs text-[#A3A3A3] hover:text-[#8CF000] active:text-[#8CF000] font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Falar com Consultor Especialista</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Indicadores do Carrossel Imediatamente Abaixo do Conteúdo */}
          <div className="flex items-center justify-center gap-3 pt-1 pb-1">
            <span className="text-[11px] font-mono font-bold text-[#8CF000]">0{current + 1}</span>
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Ir para slide ${idx + 1}`}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: current === idx ? 28 : 8 }}
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-colors ${
                      current === idx
                        ? 'bg-[#8CF000] shadow-[0_0_8px_#8CF000]'
                        : 'bg-[#3A3A3A]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-[#737373]">0{SLIDES.length}</span>
          </div>
        </div>

        {/* Diferenciais Comerciais: Seção Compacta Abaixo do Hero Mobile */}
        <div className="w-full px-4 pt-1 pb-2">
          <div className="w-full grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#141414] border border-[#262626]">
            {slide.features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center text-center gap-1 p-1"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000]">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] leading-tight font-semibold text-[#E5E5E5] line-clamp-2">
                    {feat.shortText || feat.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. VERSÃO DESKTOP (md:block): Layout Original 100% Preservado Sem Alteração
          ========================================================================= */}
      <div className="hidden md:block relative w-full h-[680px] lg:h-[720px] overflow-hidden">
        {/* Background Images with Crisp Cross-Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`desk-${slide.id}`}
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.imageUrl}
              alt={`${slide.titlePrefix} ${slide.highlight}`}
              fill
              priority
              quality={95}
              className="object-cover"
              style={{ objectPosition: slide.objectPositionDesktop }}
              sizes="100vw"
            />

            {/* Degradês Dark Premium Desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/95 via-[#080808]/75 lg:via-[#080808]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(8,8,8,0.5)_100%)] pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Container Desktop */}
        <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-8 flex flex-col justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desk-content-${slide.id}`}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -16 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6"
            >
              {/* Tag Pill com Indicador Pulsante */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1C1C1C]/85 border border-[#303030] text-xs font-medium text-white backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#8CF000] shadow-[0_0_8px_#8CF000] animate-pulse" />
                <span className="tracking-wide uppercase text-[11px] font-semibold text-[#E5E5E5]">
                  {slide.tag}
                </span>
              </div>

              {/* Título Principal Desktop */}
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                {slide.titlePrefix}{' '}
                <span className="text-[#8CF000] drop-shadow-[0_2px_24px_rgba(140,240,0,0.45)]">
                  {slide.highlight}
                </span>
              </h1>

              {/* Subtítulo Desktop */}
              <p className="text-base lg:text-lg text-[#D4D4D4] max-w-xl font-normal leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Botões de Ação Desktop */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={slide.buttonLink}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-base transition-all shadow-[0_0_20px_rgba(140,240,0,0.35)] hover:shadow-[0_0_30px_rgba(140,240,0,0.6)] group"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#1C1C1C]/80 hover:bg-[#252525] border border-[#303030] text-white font-semibold text-sm transition-colors backdrop-blur-sm hover:border-[#8CF000]/50"
                  >
                    <span>Falar com Consultor</span>
                  </Link>
                </motion.div>
              </div>

              {/* Diferenciais Comerciais no Rodapé do Bloco Desktop */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-7 text-xs text-[#A3A3A3]">
                {slide.features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000]">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium text-[#E5E5E5]">{feat.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Setas de Navegação Grandes (Apenas Desktop) */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(28,28,28,0.95)', borderColor: '#8CF000' }}
          whileTap={{ scale: 0.92 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-[#303030] text-white hover:text-[#8CF000] flex items-center justify-center transition-colors backdrop-blur-md shadow-xl"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(28,28,28,0.95)', borderColor: '#8CF000' }}
          whileTap={{ scale: 0.92 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 border border-[#303030] text-white hover:text-[#8CF000] flex items-center justify-center transition-colors backdrop-blur-md shadow-xl"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Barra Inferior com Contador e Dots (Apenas Desktop) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#303030]">
          <span className="text-xs font-mono font-bold text-[#8CF000]">0{current + 1}</span>
          <div className="flex items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: current === idx ? 32 : 10 }}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-colors ${
                    current === idx ? 'bg-[#8CF000] shadow-[0_0_8px_#8CF000]' : 'bg-[#404040] hover:bg-[#606060]'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-[#A3A3A3]">0{SLIDES.length}</span>
        </div>
      </div>
    </section>
  );
}
