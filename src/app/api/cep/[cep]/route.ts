import { NextResponse } from 'next/server';
import { lookupCEP, calculateShippingOptions } from '@/lib/shipping';

export async function GET(
  req: Request,
  { params }: { params: { cep: string } }
) {
  try {
    const cep = params.cep;
    const { searchParams } = new URL(req.url);
    const subtotal = parseFloat(searchParams.get('subtotal') || '0');

    const address = await lookupCEP(cep);

    if (!address) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 });
    }

    const shippingOptions = calculateShippingOptions(cep, subtotal);

    return NextResponse.json({ address, shippingOptions });
  } catch (error) {
    console.error('Erro na consulta de CEP:', error);
    return NextResponse.json(
      { error: 'Erro ao processar consulta de CEP' },
      { status: 500 }
    );
  }
}
