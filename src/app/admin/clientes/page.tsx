import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatDate } from '@/lib/utils';
import { User, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: true,
      addresses: true,
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Clientes Cadastrados"
        subtitle="Consulte o histórico de compras e dados cadastrais dos clientes da loja."
      />

      <div className="px-6 sm:px-8">
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#737373] uppercase text-[10px] border-b border-[#242424]">
                <tr>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">E-mail</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">CPF</th>
                  <th className="py-3.5 px-4">Cadastro</th>
                  <th className="py-3.5 px-4 text-right">Pedidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#191919] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1F1F1F] text-[#8CF000] flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A3A3A3]">{c.email}</td>
                    <td className="py-3.5 px-4 text-[#A3A3A3]">{c.phone || '—'}</td>
                    <td className="py-3.5 px-4 font-mono text-[#A3A3A3]">{c.cpf || '—'}</td>
                    <td className="py-3.5 px-4 text-[#737373]">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#8CF000]">
                      {c.orders.length} pedidos
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

