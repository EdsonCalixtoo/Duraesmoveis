import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import SalesBarChart from '@/components/admin/SalesBarChart';

export default function AdminReportsPage() {
  const chartData = [
    { day: 'Semana 1', sales: 28400 },
    { day: 'Semana 2', sales: 34100 },
    { day: 'Semana 3', sales: 29800 },
    { day: 'Semana 4', sales: 32020 },
  ];

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Relatórios & Performance"
        subtitle="Métricas de faturamento, canais de conversão e produtos com melhor margem."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Faturamento Semanal</h3>
          <SalesBarChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
