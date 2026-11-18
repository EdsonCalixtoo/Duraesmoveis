import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function resolveCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const sessionUserId = (session?.user as unknown as { id?: string })?.id;
  if (sessionUserId) return sessionUserId;

  const defaultCustomer = await prisma.user.findFirst({
    where: { role: 'CUSTOMER' },
  });
  return defaultCustomer?.id || null;
}

export async function GET() {
  try {
    const userId = await resolveCurrentUserId();
    if (!userId) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Ordenar endereço padrão primeiro
    addresses.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Erro ao carregar endereços do Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar endereços' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await resolveCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { street, number, complement, neighborhood, city, state, zipCode, isDefault } =
      await req.json();

    if (!street || !number || !city || !zipCode) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    const existingCount = await prisma.address.findMany({ where: { userId } });
    const shouldBeDefault = Boolean(isDefault) || existingCount.length === 0;

    if (shouldBeDefault && existingCount.length > 0) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const created = await prisma.address.create({
      data: {
        userId,
        street: street.trim(),
        number: number.trim(),
        complement: complement ? complement.trim() : null,
        neighborhood: (neighborhood || 'Centro').trim(),
        city: city.trim(),
        state: (state || 'SP').trim().toUpperCase(),
        zipCode: zipCode.trim(),
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json({ success: true, address: created }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar endereço no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao salvar endereço no Supabase' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await resolveCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID do endereço é obrigatório' }, { status: 400 });
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error('Erro ao definir endereço padrão no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao atualizar endereço padrão' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do endereço é obrigatório' }, { status: 400 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir endereço no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao remover endereço' }, { status: 500 });
  }
}
