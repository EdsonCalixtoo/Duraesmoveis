import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import EditProductForm from './EditProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { orderBy: { createdAt: 'asc' } },
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title={`Editar: ${product.name}`}
        subtitle={`SKU: ${product.sku} | Atualize preços, estoque, fotos e especificações técnicas.`}
      />

      <div className="px-6 sm:px-8 max-w-4xl">
        <EditProductForm
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            categoryId: product.categoryId,
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
            discountPercent: product.discountPercent,
            stock: product.stock,
            shortDescription: product.shortDescription,
            description: product.description,
            materials: product.materials,
            dimensions: product.dimensions,
            weightKg: product.weightKg ? Number(product.weightKg) : null,
            featured: product.featured,
            active: product.active,
            images: product.images.map((img) => ({
              id: img.id,
              url: img.url,
              isCover: img.isCover,
            })),
            variants: product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              colorName: v.colorName,
              colorHex: v.colorHex,
              stock: v.stock,
            })),
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}
