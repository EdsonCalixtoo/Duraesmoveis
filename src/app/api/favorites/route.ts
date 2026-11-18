import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function resolveUserId() {
  const session = await getServerSession(authOptions);
  const sessionUserId = (session?.user as unknown as { id?: string })?.id;
  if (sessionUserId) return sessionUserId;
  const defaultCustomer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return defaultCustomer?.id || null;
}

export async function GET() {
  try {
    const userId = await resolveUserId();
    const [dbFavorites, allProducts] = await Promise.all([
      userId
        ? prisma.favorite.findMany({
            where: { userId },
            include: {
              product: {
                include: {
                  images: { orderBy: { displayOrder: 'asc' } },
                },
              },
            },
          })
        : Promise.resolve([]),
      prisma.product.findMany({
        where: { active: true },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
        },
      }),
    ]);

    const favoritedProductIds = dbFavorites.map((f) => f.productId);

    return NextResponse.json({
      favoritedProductIds,
      products: allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        image: p.images[0]?.url || '/images/prod-sofa-riviera.jpg',
        stock: p.stock,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar favoritos no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar favoritos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await resolveUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    // Permitir tanto ID quanto slug do produto
    const prod = await prisma.product.findFirst({
      where: {
        OR: [{ id: productId }, { slug: productId }],
      },
    });

    const realProductId = prod?.id || productId;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: realProductId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false, productId: realProductId });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          productId: realProductId,
        },
      });
      return NextResponse.json({ favorited: true, productId: realProductId });
    }
  } catch (error) {
    console.error('Erro ao alternar favorito no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao processar favorito' }, { status: 500 });
  }
}
