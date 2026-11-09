import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import NewProductForm from './NewProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Cadastrar Novo Produto"
        subtitle="Preencha as informações completas para disponibilizar o produto no catálogo."
      />

      <div className="px-6 sm:px-8 max-w-4xl">
        <NewProductForm categories={categories} />
      </div>
    </div>
  );
}
