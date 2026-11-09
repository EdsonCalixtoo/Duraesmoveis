'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Check, ArrowRight, Eye, EyeOff, Lock, Mail, User, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '@/lib/utils';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'cadastro' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Informe e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: loginEmail.toLowerCase().trim(),
        password: loginPassword,
        redirect: false,
      });

      if (res?.error) {
        toast.error('E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.push('/conta');
      router.refresh();
    } catch {
      toast.error('Erro ao conectar ao servidor');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: regEmail,
          phone,
          cpf,
          password: regPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao realizar cadastro');
        setLoading(false);
        return;
      }

      toast.success('Conta criada com sucesso! Conectando...');

      // Auto login
      await signIn('credentials', {
        email: regEmail.toLowerCase().trim(),
        password: regPassword,
        redirect: false,
      });

      router.push('/conta');
      router.refresh();
    } catch {
      toast.error('Erro ao processar cadastro');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full bg-[#111111] border border-[#2B2B2B] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
      {/* Left Hero Box (5 Cols - Fiel à tela 06 do mockup) */}
      <div className="lg:col-span-5 relative bg-[#141414] p-8 flex flex-col justify-between overflow-hidden hidden sm:flex">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            alt="OutdoorStyle Elegance"
            fill
            className="object-cover opacity-30"
            sizes="500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#111111]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4">
          <span className="text-xl font-black text-white">
            Outdoor<span className="text-[#8CF000]">Style</span>
          </span>

          <h2 className="text-2xl font-black text-white leading-tight">
            Acesse sua conta e aproveite uma experiência{' '}
            <span className="text-[#8CF000]">completa.</span>
          </h2>
        </div>

        <div className="relative z-10 space-y-3 pt-8">
          <div className="flex items-center gap-2.5 text-xs text-[#D1D1D1]">
            <div className="w-5 h-5 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Acompanhe seus pedidos em tempo real</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#D1D1D1]">
            <div className="w-5 h-5 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Salve seus produtos favoritos</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#D1D1D1]">
            <div className="w-5 h-5 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Receba ofertas e cupons exclusivos</span>
          </div>
        </div>
      </div>

      {/* Right Form Box (7 Cols) */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
        {/* Tabs */}
        <div>
          <div className="flex rounded-xl bg-[#191919] p-1 border border-[#2E2E2E] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-[#8CF000] text-black shadow-sm'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-[#8CF000] text-black shadow-sm'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Acesse sua conta</h3>
                <p className="text-xs text-[#A3A3A3]">
                  Entre com seu e-mail e senha cadastrados.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  />
                  <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#A3A3A3]">Senha</label>
                  <button
                    type="button"
                    onClick={() => toast.info('Link de recuperação enviado para o seu e-mail cadastrado!')}
                    className="text-[11px] text-[#8CF000] hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-3 pl-10 pr-10 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  />
                  <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dica para login rápido com as contas do seed */}
              <div className="p-3 rounded-xl bg-[#181818] border border-[#2B2B2B] text-[11px] text-[#A3A3A3] space-y-1">
                <span className="text-white font-semibold block">Contas de Demonstração:</span>
                <div className="flex justify-between">
                  <span>Cliente: <strong className="text-white">edson@outdoorstyle.com.br</strong></span>
                  <span>Senha: <strong className="text-[#8CF000]">cliente123</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>Admin: <strong className="text-white">admin@outdoorstyle.com.br</strong></span>
                  <span>Senha: <strong className="text-[#8CF000]">admin123456</strong></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Entrando...</span>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Crie sua conta</h3>
                <p className="text-xs text-[#A3A3A3]">
                  Cadastre-se para aproveitar todos os benefícios exclusivos.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#A3A3A3]">Nome Completo *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Mariana Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:border-[#8CF000]"
                  />
                  <User className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#A3A3A3]">E-mail *</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="mariana@exemplo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:border-[#8CF000]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A3A3A3]">Telefone *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="(19) 99000-0000"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      required
                      className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:border-[#8CF000]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A3A3A3]">CPF *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      maxLength={14}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      required
                      className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:border-[#8CF000]"
                    />
                    <FileText className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A3A3A3]">Senha *</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 dígitos"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#8CF000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A3A3A3]">Confirmar *</label>
                  <input
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-[#303030] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#8CF000]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lime-sm disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Social login divider */}
        <div className="pt-6">
          <div className="relative text-center mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#252525]" />
            </div>
            <span className="relative bg-[#111111] px-3 text-[11px] text-[#737373]">
              ou continue com
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.info('Autenticação social disponível em produção via Google OAuth')}
              className="py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#303030] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
            >
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => toast.info('Autenticação social disponível em produção via Apple ID')}
              className="py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#303030] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
            >
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 py-12 text-white">
      <Suspense
        fallback={
          <div className="text-white text-xs text-center p-8">
            Carregando formulário...
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </div>
  );
}
