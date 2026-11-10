'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/types';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewProductForm({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [stock, setStock] = useState('10');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weightKg, setWeightKg] = useState('25');
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('/images/prod-sofa-riviera.jpg');

  // Variantes
  const [variants, setVariants] = useState([
    { name: 'Taupe', colorName: 'Taupe', colorHex: '#8C7A6B', stock: 5 },
    { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 5 },
  ]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: 'Nova Cor', colorName: 'Bege', colorHex: '#D1C7BD', stock: 5 },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !categoryId) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          categoryId,
          sku,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          discountPercent: parseInt(discountPercent, 10),
          stock: parseInt(stock, 10),
          shortDescription,
          description,
          materials,
          dimensions,
          weightKg: parseFloat(weightKg),
          featured,
          imageUrl,
          variants,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar produto');
        setLoading(false);
        return;
      }

      toast.success('Produto cadastrado com sucesso!');
      router.push('/admin/produtos');
      router.refresh();
    } catch {
      toast.error('Erro na requisição');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para lista de produtos</span>
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Salvando...' : 'Salvar Produto'}</span>
        </button>
      </div>

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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Categoria *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">URL da Imagem Principal</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">Descrição Resumida</label>
          <input
            type="text"
            placeholder="Sofá externo com estrutura em alumínio e almofadas impermeáveis..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[#A3A3A3]">Descrição Completa</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes completos sobre tecnologia de estofamento, resistência..."
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl p-4 text-xs text-white"
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
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Dimensões (L x P x A)</label>
            <input
              type="text"
              placeholder="220 cm x 85 cm x 68 cm"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="feat"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#8CF000]"
            />
            <label htmlFor="feat" className="text-xs font-semibold text-white">
              Exibir como Destaque na Página Inicial
            </label>
          </div>
        </div>
      </div>

      {/* Variantes de Cores */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <h3 className="text-sm font-bold text-white">Variações de Cores</h3>
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
            <div key={i} className="flex items-center gap-3 bg-[#1C1C1C] p-3 rounded-xl border border-[#303030]">
              <input
                type="color"
                value={v.colorHex}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[i].colorHex = e.target.value;
                  setVariants(updated);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
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
                className="flex-1 bg-[#141414] border border-[#303030] rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={v.stock}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[i].stock = parseInt(e.target.value, 10);
                  setVariants(updated);
                }}
                className="w-24 bg-[#141414] border border-[#303030] rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveVariant(i)}
                className="p-1.5 text-[#737373] hover:text-red-400"
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

