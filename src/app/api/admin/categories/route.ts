import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Erro ao carregar categorias do Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar categorias' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { name, description, imageUrl } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nome da categoria é obrigatório' }, { status: 400 });
    }

    const slug = slugify(name.trim());
    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : '/images/cat-poltronas.jpg',
        displayOrder: 10,
        active: true,
      },
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
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

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria no Supabase:', error);
    return NextResponse.json(
      { error: 'Não é possível excluir uma categoria que possui produtos vinculados' },
      { status: 400 }
    );
  }
}
