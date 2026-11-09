'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      street: 'Av. Barão de Itapura',
      number: '1234',
      complement: 'Apto 42',
      neighborhood: 'Guanabara',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13020-432',
      isDefault: true,
    },
    {
      id: '2',
      street: 'Rua das Palmeiras',
      number: '550',
      complement: 'Casa de Praia',
      neighborhood: 'Maresias',
      city: 'São Sebastião',
      state: 'SP',
      zipCode: '11628-000',
      isDefault: false,
    },
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [zipCode, setZipCode] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !number || !city || !zipCode) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const newAddr = {
      id: Date.now().toString(),
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setShowNewModal(false);
    toast.success('Endereço adicionado com sucesso!');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success('Endereço padrão atualizado!');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.info('Endereço removido');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Meus Endereços</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Cadastre múltiplos endereços para entregas na sua residência, casa de campo ou praia.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Endereço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl bg-[#141414] border transition-all space-y-3 ${
              addr.isDefault
                ? 'border-[#8CF000]/60 ring-1 ring-[#8CF000]/20'
                : 'border-[#2B2B2B] hover:border-[#3A3A3A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8CF000]" />
                <span className="text-xs font-bold text-white">
                  {addr.isDefault ? 'Endereço Principal' : 'Endereço Alternativo'}
                </span>
              </div>

              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded-full bg-[#8CF000]/10 text-[#8CF000] text-[10px] font-bold">
                  Padrão
                </span>
              )}
            </div>

            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              {addr.street}, {addr.number}
              {addr.complement ? ` - ${addr.complement}` : ''}
              <br />
              {addr.neighborhood} - {addr.city}/{addr.state}
              <br />
              CEP: {addr.zipCode}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-[#222222]">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-[#8CF000] hover:underline font-semibold"
                >
                  Tornar Padrão
                </button>
              ) : (
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8CF000]" />
                  Utilizado para cálculo
                </span>
              )}

              <button
                onClick={() => handleDelete(addr.id)}
                className="text-[#737373] hover:text-red-400 p-1"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Endereço */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#303030] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Cadastrar Novo Endereço</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                placeholder="CEP"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Logradouro / Rua / Avenida"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Número"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Complemento"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  required
                  className="bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#202020] text-xs text-white hover:bg-[#282828]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8CF000] text-black font-bold text-xs hover:bg-[#A3FF12]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
