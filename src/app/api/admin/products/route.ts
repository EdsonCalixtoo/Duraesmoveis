import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      categoryId,
      sku,
      price,
      originalPrice,
      discountPercent,
      stock,
      description,
      shortDescription,
      materials,
      dimensions,
      weightKg,
      featured,
      imageUrl,
      variants,
    } = body;

    if (!name || !categoryId || !price || !sku) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountPercent: parseInt(discountPercent || '0', 10),
        stock: parseInt(stock || '10', 10),
        description: description || name,
        shortDescription: shortDescription || null,
        materials: materials || null,
        dimensions: dimensions || null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        featured: Boolean(featured),
        active: true,
        images: {
          create: [
            {
              url:
                imageUrl ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              alt: name,
              isCover: true,
              displayOrder: 1,
            },
          ],
        },
        variants: variants && Array.isArray(variants) ? {
          create: variants.map((v: { name: string; colorName: string; colorHex: string; stock?: number }) => ({
            name: v.name || v.colorName,
            colorName: v.colorName,
            colorHex: v.colorHex || '#333333',
            stock: v.stock || 10,
          })),
        } : undefined,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return NextResponse.json(
      { error: 'Não foi possível cadastrar o produto' },
      { status: 500 }
    );
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
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Não foi possível remover o produto' },
      { status: 500 }
    );
  }
}
