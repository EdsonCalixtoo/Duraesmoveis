import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as unknown as { id?: string })?.id;

    let user = sessionUserId
      ? await prisma.user.findUnique({ where: { id: sessionUserId } })
      : null;

    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    }

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Informe a senha atual e uma nova senha com no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'A senha atual informada está incorreta' },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({ success: true, message: 'Senha atualizada no Supabase com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha no Supabase:', error);
    return NextResponse.json({ error: 'Erro ao atualizar senha' }, { status: 500 });
  }
}
