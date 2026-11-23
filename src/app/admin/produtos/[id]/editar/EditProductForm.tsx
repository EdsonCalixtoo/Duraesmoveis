'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/types';
import { Save, ArrowLeft, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProductImage {
  id?: string;
  url: string;
  isCover?: boolean;
}

interface ProductVariant {
  id?: string;
  name: string;
  colorName: string;
  colorHex: string;
  stock: number;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  stock: number;
  shortDescription: string | null;
  description: string;
  materials: string | null;
  dimensions: string | null;
  weightKg: number | null;
  featured: boolean;
  active: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export default function EditProductForm({
  product,
  categories,
}: {
  product: ProductData;
  categories: CategoryItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState(product.name || '');
  const [categoryId, setCategoryId] = useState(product.categoryId || categories[0]?.id || '');
  const [sku, setSku] = useState(product.sku || '');
  const [price, setPrice] = useState(product.price ? product.price.toString() : '');
  const [originalPrice, setOriginalPrice] = useState(
    product.originalPrice ? product.originalPrice.toString() : ''
  );
  const [discountPercent, setDiscountPercent] = useState(
    (product.discountPercent ?? 0).toString()
  );
  const [stock, setStock] = useState((product.stock ?? 10).toString());
  const [shortDescription, setShortDescription] = useState(product.shortDescription || '');
  const [description, setDescription] = useState(product.description || '');
  const [materials, setMaterials] = useState(product.materials || '');
  const [dimensions, setDimensions] = useState(product.dimensions || '');
  const [weightKg, setWeightKg] = useState(
    product.weightKg ? product.weightKg.toString() : '25'
  );
  const [featured, setFeatured] = useState(Boolean(product.featured));
  const [active, setActive] = useState(Boolean(product.active));

  const coverUrl =
    product.images?.find((img) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    '/images/prod-sofa-riviera.jpg';
  const [imageUrl, setImageUrl] = useState(coverUrl);

  // Variantes
  const [variants, setVariants] = useState<ProductVariant[]>(
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => ({
          name: v.name || v.colorName || 'Cor',
          colorName: v.colorName || v.name || 'Cor',
          colorHex: v.colorHex || '#333333',
          stock: v.stock ?? 5,
        }))
      : [
          { name: 'Padrão', colorName: 'Padrão', colorHex: '#8C7A6B', stock: 10 },
        ]
  );

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: 'Nova Cor', colorName: 'Nova Cor', colorHex: '#333333', stock: 5 },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !categoryId) {
      toast.error('Preencha os campos obrigatórios (*)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name,
          categoryId,
          sku,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          discountPercent: parseInt(discountPercent || '0', 10),
          stock: parseInt(stock || '0', 10),
          shortDescription,
          description,
          materials,
          dimensions,
          weightKg: weightKg ? parseFloat(weightKg) : null,
          featured,
          active,
          imageUrl,
          variants,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao atualizar produto');
        setLoading(false);
        return;
      }

      toast.success('Produto atualizado com sucesso!');
      router.push('/admin/produtos');
      router.refresh();
    } catch {
      toast.error('Erro na requisição ao atualizar');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para lista de produtos</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href={`/produto/${product.slug}`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white text-xs font-semibold flex items-center gap-2 border border-[#333333] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8CF000]" />
            <span>Ver no site</span>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Status & Visibilidade */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">Visibilidade do Produto</span>
          <span className="text-[11px] text-[#737373]">
            Defina se o móvel está visível no catálogo e se tem destaque especial na home.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-[#8CF000] rounded"
            />
            <span className="text-xs font-semibold text-white">Produto Ativo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#8CF000] rounded"
            />
            <span className="text-xs font-semibold text-white">Destaque na Home</span>
          </label>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#222222] pb-3">
          Informações Principais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Nome do Produto *</label>
            <input
              type="text"
              placeholder="Ex: Sofá Externo Riviera 3 Lugares"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Categoria *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">SKU (Código Único) *</label>
            <input
              type="text"
              placeholder="Ex: SOF-RIV-004"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Preço de Venda (R$) *</label>
            <input
              type="number"
              step="0.01"
              placeholder="5391.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Preço Original (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="5990.00"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Desconto (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Estoque Total *</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#8CF000] outline-none"
            />
          </div>
        </div>

        {/* Imagem Principal com Preview */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">URL da Imagem Principal</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#333333] flex-shrink-0">
              <Image
                src={imageUrl || '/images/prod-sofa-riviera.jpg'}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full flex-1 bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#8CF000] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">Descrição Resumida</label>
          <input
            type="text"
            placeholder="Sofá externo com estrutura em alumínio e almofadas impermeáveis..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">Descrição Completa</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes completos sobre tecnologia de estofamento, resistência..."
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl p-4 text-xs text-white focus:border-[#8CF000] outline-none"
          />
        </div>
      </div>

      {/* Dimensões e Materiais */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[#222222] pb-3">
          Ficha Técnica & Dimensões
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Materiais</label>
            <input
              type="text"
              placeholder="Alumínio eletrostático, Corda náutica UV, Tecido Sunbrella"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Dimensões (L x P x A)</label>
            <input
              type="text"
              placeholder="220 cm x 85 cm x 68 cm"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CF000] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Variantes de Cores */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Variações de Acabamento & Cores</h3>
            <p className="text-[11px] text-[#737373]">
              Configure as opções disponíveis para o cliente selecionar na página do produto.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            className="text-xs text-[#8CF000] font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Variação</span>
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-[#1C1C1C] p-3 rounded-xl border border-[#303030]"
            >
              <input
                type="color"
                value={v.colorHex}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[i].colorHex = e.target.value;
                  setVariants(updated);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                title="Escolher Cor"
              />
              <input
                type="text"
                placeholder="Nome da Cor (ex: Grafite)"
                value={v.colorName}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[i].colorName = e.target.value;
                  updated[i].name = e.target.value;
                  setVariants(updated);
                }}
                className="flex-1 bg-[#141414] border border-[#303030] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#8CF000] outline-none"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#737373]">Estoque:</span>
                <input
                  type="number"
                  placeholder="Estoque"
                  value={v.stock}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[i].stock = parseInt(e.target.value, 10) || 0;
                    setVariants(updated);
                  }}
                  className="w-20 bg-[#141414] border border-[#303030] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#8CF000] outline-none font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVariant(i)}
                className="p-1.5 text-[#737373] hover:text-red-400 transition-colors"
                title="Remover Variação"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
