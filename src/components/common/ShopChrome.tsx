'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBenefitBar from './TopBenefitBar';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function ShopChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBenefitBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
