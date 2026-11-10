'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function PageProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {animating && (
        <motion.div
          key="progress-bar"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, delay: 0.1 },
          }}
          style={{ transformOrigin: '0%' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8CF000] via-[#A3FF12] to-[#8CF000] z-[9999] pointer-events-none shadow-[0_0_12px_rgba(140,240,0,0.8)]"
        />
      )}
    </AnimatePresence>
  );
}

export default function PageProgress() {
  return (
    <Suspense fallback={null}>
      <PageProgressInner />
    </Suspense>
  );
}
