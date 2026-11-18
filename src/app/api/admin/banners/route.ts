import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Erro ao buscar banners no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar banners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { title, highlightText, subtitle, buttonText, buttonLink, imageUrl } = await req.json();

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Título e imagem são obrigatórios' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title: String(title).trim(),
        highlightText: highlightText ? String(highlightText).trim() : null,
        subtitle: subtitle ? String(subtitle).trim() : null,
        buttonText: buttonText ? String(buttonText).trim() : 'Ver Coleção Completa',
        buttonLink: buttonLink ? String(buttonLink).trim() : '/catalogo',
        imageUrl: String(imageUrl).trim(),
        active: true,
        displayOrder: 1,
        position: 'HERO',
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar banner no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 });
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

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir banner no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao remover banner' }, { status: 500 });
  }
}
