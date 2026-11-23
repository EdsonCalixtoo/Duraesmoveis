'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductActions({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Erro ao excluir produto');
        return;
      }

      toast.success('Produto removido com sucesso!');
      router.refresh();
    } catch {
      toast.error('Erro de conexão ao excluir produto');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/admin/produtos/${productId}/editar`}
        className="p-1.5 rounded-lg text-[#737373] hover:text-[#8CF000] hover:bg-[#1E1E1E] transition-colors inline-flex items-center justify-center"
        title="Editar Produto"
      >
        <Edit3 className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-[#737373] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors inline-flex items-center justify-center"
        title="Excluir Produto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

