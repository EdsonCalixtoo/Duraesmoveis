'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import PageTransition from './PageTransition';
import PageProgress from './PageProgress';

export default function ShopChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <PageProgress />
        <PageTransition>{children}</PageTransition>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageProgress />
      <Header />
      <main className="flex-1 flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

