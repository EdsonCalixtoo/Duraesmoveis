import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return NextResponse.json({ error: 'Erro ao processar favorito' }, { status: 500 });
  }
}
