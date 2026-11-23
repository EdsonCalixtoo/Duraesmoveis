'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '5519988254919';
  const defaultMessage = encodeURIComponent(
    'Olá! Estive navegando no site da Durães Móveis e gostaria de falar com um consultor sobre os móveis para área externa.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2.5">
      {/* Tooltip flutuante sutil */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:flex items-center gap-2 bg-[#141414] border border-[#2E2E2E] px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#8CF000] animate-ping" />
            <span className="text-xs font-semibold text-white">Consultor Online</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[#737373] hover:text-white p-0.5 ml-1 transition-colors"
              aria-label="Fechar aviso"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Principal WhatsApp */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com consultor no WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#181818] border-2 border-[#8CF000] flex items-center justify-center text-[#8CF000] shadow-[0_0_20px_rgba(140,240,0,0.4)] hover:shadow-[0_0_28px_rgba(140,240,0,0.7)] hover:bg-[#8CF000] hover:text-black transition-all group"
      >
        <span className="sr-only">Atendimento WhatsApp</span>
        {/* WhatsApp SVG oficial */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </motion.a>
    </div>
  );
}
