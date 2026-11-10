const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log('Total products:', prods.length);
  prods.forEach(p => {
    console.log(`- ID: ${p.id} | SKU: ${p.sku} | Slug: ${p.slug}`);
    console.log(`  Name: ${p.name}`);
    console.log(`  Category: ${p.category?.name} (${p.category?.slug})`);
    console.log(`  Price: R$ ${p.price} | Promo: R$ ${p.promoPrice}`);
    console.log(`  Images (${p.images.length}):`, p.images.map(i => i.url).join(', '));
    console.log(`  Variants (${p.variants.length}):`, p.variants.map(v => `${v.name} (${v.colorName})`).join(', '));
    console.log('---');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

