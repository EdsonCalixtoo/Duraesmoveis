import { redirect } from 'next/navigation';

export default function AdminProductIndexPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/admin/produtos/${params.id}/editar`);
}
