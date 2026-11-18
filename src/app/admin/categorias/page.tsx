'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/cat-poltronas.jpg');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data?.categories)) {
        setCategories(data.categories);
      }
    } catch {
      // Silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Erro ao criar categoria');
        return;
      }
      toast.success('Categoria criada no Supabase com sucesso!');
      setShowModal(false);
      setName('');
      setDescription('');
      await loadCategories();
    } catch {
      toast.error('Erro ao criar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if ((cat._count?.products || 0) > 0) {
      toast.error('Não é possível excluir uma categoria que possui produtos cadastrados.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(cat.id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.info('Categoria removida do Supabase');
    } catch {
      toast.error('Erro ao excluir categoria');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Categorias"
        subtitle="Gerencie as categorias de produtos sincronizadas com o banco Supabase."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Categoria</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#A3A3A3]">
            Carregando categorias do Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-[#2E2E2E] flex-shrink-0">
                    <Image
                      src={c.imageUrl || '/images/cat-poltronas.jpg'}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                    <span className="text-[11px] text-[#8CF000] font-semibold block">
                      {c._count?.products || 0} produtos cadastrados
                    </span>
                    <span className="text-[10px] text-[#737373]">slug: /{c.slug}</span>
                  </div>
                </div>

                {(c._count?.products || 0) === 0 && (
                  <button
                    onClick={() => handleDelete(c)}
                    className="text-[#737373] hover:text-red-400 p-1.5"
                    title="Excluir categoria vazia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#303030] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Nova Categoria no Supabase</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Nome da Categoria (ex: Ombrelones)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Descrição da categoria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="URL da Imagem (ex: /images/cat-guarda-sois.jpg)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#202020] text-xs text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#8CF000] text-black font-bold text-xs disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
