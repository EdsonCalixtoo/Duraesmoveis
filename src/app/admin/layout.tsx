import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'OutdoorStyle — Painel Administrativo',
  description: 'Painel de gestão da loja virtual OutdoorStyle.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
