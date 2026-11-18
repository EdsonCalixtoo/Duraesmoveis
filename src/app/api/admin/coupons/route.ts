import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Erro ao buscar cupons no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar cupons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { code, description, discountType, discountValue, minOrderValue } = await req.json();

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Código e valor do desconto são obrigatórios' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase().trim(),
        description: description ? String(description).trim() : null,
        discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || '0'),
        active: true,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cupom no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { id, active } = await req.json();
    const updated = await prisma.coupon.update({
      where: { id },
      data: { active: Boolean(active) },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error('Erro ao atualizar cupom no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao atualizar cupom' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir cupom no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao remover cupom' }, { status: 500 });
  }
}
