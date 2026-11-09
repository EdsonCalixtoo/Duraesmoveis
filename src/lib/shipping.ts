import { ShippingOption } from '@/types';

export async function lookupCEP(cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  error?: string;
} | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      cache: 'force-cache',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;

    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      zipCode: clean,
    };
  } catch {
    // Fallback if offline
    if (clean.startsWith('13')) {
      return {
        street: 'Av. Barão de Itapura',
        neighborhood: 'Guanabara',
        city: 'Campinas',
        state: 'SP',
        zipCode: clean,
      };
    }
    return {
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: clean,
    };
  }
}

export function calculateShippingOptions(
  zipCode: string,
  subtotal: number,
  _weightKg: number = 25
): ShippingOption[] {
  const clean = zipCode.replace(/\D/g, '');
  const isFree = subtotal >= 2999;

  // Calculo de prazo baseado na região do Brasil pelo primeiro dígito do CEP
  const firstDigit = clean[0] || '1';
  let baseDays = 4;
  let basePrice = 149;

  switch (firstDigit) {
    case '0':
    case '1': // SP Capital e Interior
      baseDays = 3;
      basePrice = 98;
      break;
    case '2': // RJ / ES
      baseDays = 5;
      basePrice = 135;
      break;
    case '3': // MG
      baseDays = 5;
      basePrice = 145;
      break;
    case '4': // BA / SE
      baseDays = 7;
      basePrice = 195;
      break;
    case '5': // PE / AL / PB / RN
      baseDays = 8;
      basePrice = 215;
      break;
    case '6': // CE / PI / MA / PA / AP / AM / RR / AC
      baseDays = 10;
      basePrice = 280;
      break;
    case '7': // DF / GO / TO / MT / MS
      baseDays = 6;
      basePrice = 175;
      break;
    case '8': // PR / SC
      baseDays = 4;
      basePrice = 130;
      break;
    case '9': // RS
      baseDays = 5;
      basePrice = 150;
      break;
    default:
      baseDays = 5;
      basePrice = 150;
  }

  const specializedPrice = isFree ? 0 : basePrice;

  return [
    {
      id: 'transportadora_especializada',
      name: 'Transportadora Especializada',
      carrier: 'OutdoorLog Móveis de Luxo',
      price: specializedPrice,
      estimatedDays: baseDays + 2,
      description: isFree
        ? 'Frete Grátis Especial (Veículo acolchoado e agendamento de entrega)'
        : 'Caminhão baú acolchoado com rastreio em tempo real e agendamento',
    },
    {
      id: 'entrega_expressa',
      name: 'Entrega Expressa VIP',
      carrier: 'OutdoorStyle Express Direct',
      price: isFree ? 89 : basePrice + 75,
      estimatedDays: Math.max(2, baseDays - 1),
      description: 'Prioridade máxima no despacho e entrega assistida para grandes volumes',
    },
  ];
}
