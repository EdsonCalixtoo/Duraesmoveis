'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { CategoryItem } from '@/types';

interface CatalogFiltersProps {
  currentCategory?: string;
  currentSort: string;
  categories: CategoryItem[];
}

export default function CatalogFilters({
  currentCategory,
  currentSort,
  categories,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/catalogo?${params.toString()}`);
  };

  const handleCategorySelect = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('categoria', slug);
    } else {
      params.delete('categoria');
    }
    router.push(`/catalogo?${params.toString()}`);
    setFilterDrawerOpen(false);
  };

  const handleMaterialFilter = (material: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentMat = params.get('material');
    if (currentMat === material) {
      params.delete('material');
    } else {
      params.set('material', material);
    }
    router.push(`/catalogo?${params.toString()}`);
    setFilterDrawerOpen(false);
  };

  const currentMaterial = searchParams.get('material');

  return (
    <div className="flex items-center gap-3">
      {/* Botão de Filtros */}
      <button
        onClick={() => setFilterDrawerOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1C1C] border border-[#303030] hover:border-[#8CF000] text-xs font-semibold text-white transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#8CF000]" />
        <span>Filtros</span>
        {(currentCategory || currentMaterial) && (
          <span className="w-2 h-2 rounded-full bg-[#8CF000]" />
        )}
      </button>

      {/* Seletor de Ordenação */}
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="appearance-none bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-white cursor-pointer hover:border-[#8CF000] transition-colors focus:border-[#8CF000]"
        >
          <option value="mais-vendidos">Ordenar: Mais Vendidos</option>
          <option value="menor-preco">Menor Preço</option>
          <option value="maior-preco">Maior Preço</option>
          <option value="mais-novos">Lançamentos</option>
          <option value="maior-desconto">Maiores Descontos</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#A3A3A3] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Drawer de Filtros */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setFilterDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#111111] border-l border-[#303030] p-6 text-white flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#8CF000]" />
                    <h3 className="font-bold text-base">Filtrar Produtos</h3>
                  </div>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[#1C1C1C] text-[#A3A3A3]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filtro por Categoria */}
                <div className="py-5 border-b border-[#252525]">
                  <h4 className="text-xs font-bold uppercase text-[#8CF000] tracking-wider mb-3">
                    Categorias
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategorySelect(undefined)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        !currentCategory
                          ? 'bg-[#1C1C1C] text-[#8CF000] border border-[#8CF000]/30'
                          : 'text-[#A3A3A3] hover:text-white'
                      }`}
                    >
                      Todas as Categorias
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCategorySelect(c.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currentCategory === c.slug
                            ? 'bg-[#1C1C1C] text-[#8CF000] border border-[#8CF000]/30'
                            : 'text-[#A3A3A3] hover:text-white'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por Material */}
                <div className="py-5 border-b border-[#252525]">
                  <h4 className="text-xs font-bold uppercase text-[#8CF000] tracking-wider mb-3">
                    Material Estrutural
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Alumínio', 'Corda Náutica', 'Fibra Sintética', 'Madeira Teca'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => handleMaterialFilter(mat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentMaterial === mat
                            ? 'bg-[#8CF000] text-black font-bold'
                            : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border border-[#303030]'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão Limpar / Fechar */}
              <div className="pt-4 border-t border-[#252525] flex gap-3">
                <button
                  onClick={() => {
                    router.push('/catalogo');
                    setFilterDrawerOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#353535] text-xs font-semibold text-[#A3A3A3] hover:text-white"
                >
                  Limpar Todos
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#8CF000] text-black text-xs font-bold hover:bg-[#A3FF12]"
                >
                  Ver Resultados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

