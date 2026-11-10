'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  height?: number;
}

export default function Logo({ className = '', height = 48 }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none transition-transform hover:scale-[1.02] ${className}`}
      title="Durães Móveis — Móveis para Áreas Externas"
    >
      <div className="relative h-12 w-48 sm:w-56 flex items-center">
        <Image
          src="/images/logo-duraes-moveis.png"
          alt="Durães Móveis"
          width={220}
          height={73}
          priority
          className="object-contain h-full w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
        />
      </div>
    </Link>
  );
}
