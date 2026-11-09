import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error }, { status: 400 });
    }

    const { productId, rating, title, comment } = parsed.data;

    const userName = session?.user?.name || body.userName || 'Cliente Verificado';
    const userId = (session?.user as unknown as { id?: string })?.id || null;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        userName,
        rating,
        title,
        comment,
        verifiedPurchase: true,
      },
    });

    // Recalcular média de avaliações do produto
    const allReviews = await prisma.review.findMany({
      where: { productId, active: true },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / (allReviews.length || 1);

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Erro ao postar avaliação:', error);
    return NextResponse.json({ error: 'Erro ao registrar avaliação' }, { status: 500 });
  }
}
