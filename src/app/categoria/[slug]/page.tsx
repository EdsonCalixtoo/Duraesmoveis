import { redirect } from 'next/navigation';

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/catalogo?categoria=${params.slug}`);
}
