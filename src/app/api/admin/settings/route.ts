import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json({ settings: map });
  } catch (error) {
    console.error('Erro ao carregar configurações da loja:', error);
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const entries = Object.entries(body as Record<string, string>);

    for (const [key, value] of entries) {
      if (typeof value !== 'string') continue;
      await prisma.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value, description: `Configuração ${key}` },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar configurações da loja:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}

