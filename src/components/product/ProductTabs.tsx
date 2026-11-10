'use client';

import React, { useState } from 'react';
import { Star, Shield, Box, Sparkles, Ruler } from 'lucide-react';
import { ProductItem } from '@/types';
import { toast } from 'sonner';

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string | Date;
}

export default function ProductTabs({
  product,
  initialReviews = [],
}: {
  product: ProductItem;
  initialReviews?: ReviewItem[];
}) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'medidas' | 'reviews'>('desc');
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  // Formulário de nova avaliação
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !title.trim()) {
      toast.error('Preencha o título e o comentário');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating,
          userName: name.trim() || 'Cliente Verificado',
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao enviar avaliação');
        return;
      }

      setReviews([data.review, ...reviews]);
      setTitle('');
      setComment('');
      toast.success('Avaliação publicada com sucesso!');
    } catch {
      toast.error('Erro de conexão ao enviar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 bg-[#111111] rounded-2xl border border-[#2B2B2B] overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex border-b border-[#252525] overflow-x-auto no-scrollbar bg-[#141414]">
        <button
          onClick={() => setActiveTab('desc')}
          className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex-shrink-0 ${
            activeTab === 'desc'
              ? 'border-[#8CF000] text-[#8CF000] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-white'
          }`}
        >
          Descrição
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex-shrink-0 ${
            activeTab === 'specs'
              ? 'border-[#8CF000] text-[#8CF000] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-white'
          }`}
        >
          Especificações
        </button>

        <button
          onClick={() => setActiveTab('medidas')}
          className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex-shrink-0 ${
            activeTab === 'medidas'
              ? 'border-[#8CF000] text-[#8CF000] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-white'
          }`}
        >
          Medidas
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex-shrink-0 ${
            activeTab === 'reviews'
              ? 'border-[#8CF000] text-[#8CF000] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-white'
          }`}
        >
          Avaliações ({reviews.length || product.reviewsCount})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8">
        {activeTab === 'desc' && (
          <div className="space-y-6 text-[#C7C7C7] text-sm leading-relaxed max-w-4xl">
            <p>{product.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#181818] border border-[#2B2B2B]">
                <Shield className="w-5 h-5 text-[#8CF000] mb-2" />
                <h4 className="text-white font-bold text-xs">Proteção UV 50+</h4>
                <p className="text-[#8E8E8E] text-[11px] mt-1">
                  Pigmentação interna nas fibras que impede o desbotamento mesmo sob forte sol tropical.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#181818] border border-[#2B2B2B]">
                <Box className="w-5 h-5 text-[#8CF000] mb-2" />
                <h4 className="text-white font-bold text-xs">Estrutura em Alumínio</h4>
                <p className="text-[#8E8E8E] text-[11px] mt-1">
                  100% imune à ferrugem, permitindo uso em áreas litorâneas com alta salinidade.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#181818] border border-[#2B2B2B]">
                <Sparkles className="w-5 h-5 text-[#8CF000] mb-2" />
                <h4 className="text-white font-bold text-xs">Tecido Hidro-Repelente</h4>
                <p className="text-[#8E8E8E] text-[11px] mt-1">
                  Líquidos não penetram nas fibras; fácil de limpar com apenas sabão neutro e água.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#252525]">
                  <td className="py-3 text-[#8E8E8E] font-medium w-1/3">SKU</td>
                  <td className="py-3 text-white font-mono">{product.sku}</td>
                </tr>
                <tr className="border-b border-[#252525]">
                  <td className="py-3 text-[#8E8E8E] font-medium">Categoria</td>
                  <td className="py-3 text-white">{product.category?.name || 'Móveis Externos'}</td>
                </tr>
                <tr className="border-b border-[#252525]">
                  <td className="py-3 text-[#8E8E8E] font-medium">Materiais</td>
                  <td className="py-3 text-white">
                    {product.materials || 'Alumínio eletrostático naval, Corda sintética trançada e Tecido náutico'}
                  </td>
                </tr>
                <tr className="border-b border-[#252525]">
                  <td className="py-3 text-[#8E8E8E] font-medium">Acabamento</td>
                  <td className="py-3 text-white">Pintura microtexturizada de alta resistência</td>
                </tr>
                <tr className="border-b border-[#252525]">
                  <td className="py-3 text-[#8E8E8E] font-medium">Garantia</td>
                  <td className="py-3 text-[#8CF000] font-bold">5 Anos de garantia de fábrica</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'medidas' && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-6 rounded-2xl bg-[#181818] border border-[#2B2B2B] flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#222222] border border-[#353535] flex items-center justify-center text-[#8CF000] flex-shrink-0">
                <Ruler className="w-10 h-10" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-white font-bold text-base">Ficha de Dimensões</h4>
                <p className="text-xs text-[#A3A3A3]">
                  Dimensões totais: <strong className="text-white">{product.dimensions || '220 cm (L) x 85 cm (P) x 68 cm (A)'}</strong>
                </p>
                <p className="text-xs text-[#A3A3A3]">
                  Peso aproximado: <strong className="text-white">{product.weightKg || 34.5} kg</strong>
                </p>
                <p className="text-xs text-[#A3A3A3]">
                  Capacidade de peso suportado: <strong className="text-[#8CF000]">Até 360 kg</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-3xl">
            {/* Avaliações listadas */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-[#8E8E8E]">Nenhuma avaliação enviada ainda. Seja o primeiro a avaliar!</p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                        <span className="text-[10px] bg-[#8CF000]/10 text-[#8CF000] px-2 py-0.5 rounded-full font-semibold">
                          Compra Verificada
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h5 className="text-xs font-bold text-white">{rev.title}</h5>}
                    <p className="text-xs text-[#A3A3A3] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Form de Nova Avaliação */}
            <form onSubmit={handleSubmitReview} className="p-6 rounded-2xl bg-[#161616] border border-[#2E2E2E] space-y-4">
              <h4 className="text-sm font-bold text-white">Deixe sua avaliação sobre o produto</h4>

              {/* Seletor de estrelas */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A3A3A3]">Sua nota:</span>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1C1C1C] border border-[#333333] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#737373]"
                />
                <input
                  type="text"
                  placeholder="Título da avaliação (ex: Excelente compra!)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-[#1C1C1C] border border-[#333333] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#737373]"
                />
              </div>

              <textarea
                placeholder="Compartilhe os detalhes da sua experiência com este produto..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl p-3.5 text-xs text-white placeholder-[#737373]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Avaliação'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

