'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BannerItem {
  id: string;
  title: string;
  highlightText?: string | null;
  subtitle?: string | null;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('Ver Coleção Completa');
  const [buttonLink, setButtonLink] = useState('/catalogo');
  const [imageUrl, setImageUrl] = useState('/images/hero-outdoor-luxury-uhd.jpg');
  const [saving, setSaving] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (Array.isArray(data?.banners)) {
        setBanners(data.banners);
      }
    } catch {
      // Silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          highlightText,
          subtitle,
          buttonText,
          buttonLink,
          imageUrl,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Banner criado no Supabase com sucesso!');
      setShowModal(false);
      setTitle('');
      setHighlightText('');
      setSubtitle('');
      await loadBanners();
    } catch {
      toast.error('Erro ao criar banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/banners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.info('Banner removido do Supabase');
    } catch {
      toast.error('Erro ao excluir banner');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Banners da Página Inicial"
        subtitle="Gerencie as campanhas em destaque salvas no banco de dados Supabase."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Banner</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#A3A3A3]">
            Carregando banners do Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden space-y-4 p-4"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900 border border-[#2A2A2A]">
                  <Image src={b.imageUrl} alt={b.title} fill className="object-cover" sizes="600px" />
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-red-500 flex items-center justify-center transition-colors"
                    title="Excluir banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <h3 className="text-sm font-bold text-white">
                      {b.title} <span className="text-[#8CF000]">{b.highlightText}</span>
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-[#A3A3A3] space-y-1">
                  <p>{b.subtitle}</p>
                  <div className="pt-2 flex justify-between text-[#737373] text-[11px]">
                    <span>Botão: {b.buttonText}</span>
                    <span>Link: {b.buttonLink}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#303030] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Adicionar Banner no Supabase</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Título principal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Texto em destaque (Verde-Limão)"
                value={highlightText}
                onChange={(e) => setHighlightText(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Subtítulo descritivo"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="URL da Imagem (ex: /images/hero-outdoor-luxury-uhd.jpg)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Texto do Botão"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Link do Botão"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

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
                  {saving ? 'Salvando...' : 'Salvar Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
