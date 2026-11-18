import React from 'react';
import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import CommercialBenefits from '@/components/home/CommercialBenefits';
import BestSellers from '@/components/home/BestSellers';
import SpecialOffersBanner from '@/components/home/SpecialOffersBanner';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import { ProductItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: unknown[] = [];
  let categories: { name: string; slug: string; imageUrl?: string | null }[] = [];
  try {
    const [dbProducts, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        orderBy: { reviewsCount: 'desc' },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          variants: true,
          category: true,
        },
        take: 10,
      }),
      prisma.category.findMany({
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);
    products = dbProducts;
    categories = dbCategories;
  } catch (error) {
    console.warn('Banco de dados ainda não inicializado ou indisponível na build:', error);
  }

  return (
    <div className="w-full">
      {/* 01. Banner Principal com Carrossel */}
      <HeroSlider />

      {/* 02. Categorias Ilustradas */}
      <CategoryGrid categories={categories} />

      {/* 03. Benefícios Comerciais */}
      <CommercialBenefits />

      {/* 04. Mais Vendidos */}
      <BestSellers products={products as unknown as ProductItem[]} />

      {/* 05. Ofertas Especiais & Coleção */}
      <SpecialOffersBanner />

      {/* 06. Depoimentos de Clientes */}
      <Testimonials />

      {/* 07. Newsletter com Cupom */}
      <Newsletter />
    </div>
  );
}
