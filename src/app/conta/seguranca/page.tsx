'use client';

import React, { useState } from 'react';
import { KeyRound, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('A confirmação da nova senha não confere');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Senha alterada com sucesso!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Alterar Senha</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Atualize sua senha periodicamente para manter sua conta protegida.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 max-w-md">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Senha Atual</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Nova Senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Atualizando...' : 'Atualizar Senha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
