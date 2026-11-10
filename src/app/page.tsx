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

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  let products: unknown[] = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { reviewsCount: 'desc' },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
      },
      take: 10,
    });
  } catch (error) {
    console.warn('Banco de dados ainda não inicializado ou indisponível na build:', error);
  }

  return (
    <div className="w-full">
      {/* 01. Banner Principal com Carrossel */}
      <HeroSlider />

      {/* 02. Categorias Ilustradas */}
      <CategoryGrid />

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
