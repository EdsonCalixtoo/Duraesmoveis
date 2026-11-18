import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function resolveCurrentUser() {
  const session = await getServerSession(authOptions);
  const sessionUserId = (session?.user as unknown as { id?: string })?.id;
  const sessionEmail = session?.user?.email;

  if (sessionUserId) {
    const byId = await prisma.user.findUnique({ where: { id: sessionUserId } });
    if (byId) return byId;
  }
  if (sessionEmail) {
    const byEmail = await prisma.user.findUnique({ where: { email: sessionEmail } });
    if (byEmail) return byEmail;
  }

  // Fallback para o cliente padrão no Supabase caso esteja testando a tela sem sessão ativa
  const defaultCustomer = await prisma.user.findFirst({
    where: { role: 'CUSTOMER' },
  });
  return defaultCustomer;
}

export async function GET() {
  try {
    const user = await resolveCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        cpf: user.cpf || '',
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar perfil no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao carregar dados pessoais' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await resolveCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { name, phone, cpf } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'O nome completo é obrigatório' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        cpf: cpf ? cpf.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || '',
        cpf: updated.cpf || '',
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao salvar dados no Supabase' }, { status: 500 });
  }
}
