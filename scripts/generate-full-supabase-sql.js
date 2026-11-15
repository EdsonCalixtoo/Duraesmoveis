const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function sqlVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return Number.isFinite(val) ? String(val) : 'NULL';
  if (val instanceof Date) return `'${val.toISOString()}'`;
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

function buildInserts(tableName, rows, columns) {
  if (!rows || rows.length === 0) return `-- Sem registros para ${tableName}\n`;
  const lines = [`-- Inserindo ${rows.length} registros em "${tableName}"`];
  const colList = columns.map((c) => `"${c}"`).join(', ');
  for (const row of rows) {
    const vals = columns.map((c) => sqlVal(row[c])).join(', ');
    lines.push(`INSERT INTO "${tableName}" (${colList}) VALUES (${vals});`);
  }
  return lines.join('\n') + '\n\n';
}

async function main() {
  console.log('Lendo DDL de prisma/init-supabase.sql...');
  const ddlPath = path.join(__dirname, '..', 'prisma', 'init-supabase.sql');
  const rawBuf = fs.readFileSync(ddlPath);
  let ddl = '';
  // Detect UTF-16LE BOM (FF FE) or null bytes from PowerShell redirection
  if ((rawBuf[0] === 0xff && rawBuf[1] === 0xfe) || rawBuf.includes(0x00)) {
    ddl = rawBuf.toString('utf16le');
  } else {
    ddl = rawBuf.toString('utf8');
  }
  ddl = ddl.replace(/^\uFEFF/, '').replace(/\0/g, '').replace(/\r\n/g, '\n');
  fs.writeFileSync(ddlPath, ddl, 'utf8');

  let out = `-- =====================================================================
-- DURÃES MÓVEIS - SETUP COMPLETO SUPABASE POSTGRESQL (DDL + DADOS REAIS)
-- =====================================================================

-- 1. Limpar tabelas anteriores caso existam
DROP TABLE IF EXISTS
  "StoreSetting",
  "Banner",
  "Favorite",
  "Coupon",
  "Review",
  "Payment",
  "OrderStatusHistory",
  "OrderItem",
  "Order",
  "CartItem",
  "Cart",
  "ProductVariant",
  "ProductImage",
  "Product",
  "Category",
  "Address",
  "User"
CASCADE;

-- 2. Criar todas as tabelas, índices e chaves estrangeiras
${ddl}

-- 3. Configurar senha do usuário postgres para conexão direta do Prisma (DATABASE_URL)
DO $$
BEGIN
  ALTER USER postgres WITH PASSWORD 'DuraesMoveis2026DbPass';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Aviso ao definir senha do postgres: %', SQLERRM;
END $$;

-- 4. Garantir permissões no schema public para os papéis do Supabase
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 5. Inserir todos os dados reais da loja Durães Móveis
`;

  const storeSettings = await prisma.storeSetting.findMany();
  out += buildInserts('StoreSetting', storeSettings, ['id', 'key', 'value', 'description', 'updatedAt']);

  const banners = await prisma.banner.findMany();
  out += buildInserts('Banner', banners, [
    'id', 'title', 'highlightText', 'subtitle', 'buttonText', 'buttonLink',
    'imageUrl', 'active', 'displayOrder', 'position', 'createdAt', 'updatedAt',
  ]);

  const coupons = await prisma.coupon.findMany();
  out += buildInserts('Coupon', coupons, [
    'id', 'code', 'description', 'discountType', 'discountValue', 'minOrderValue',
    'maxUses', 'currentUses', 'validFrom', 'validUntil', 'active', 'createdAt', 'updatedAt',
  ]);

  const users = await prisma.user.findMany();
  out += buildInserts('User', users, [
    'id', 'name', 'email', 'passwordHash', 'role', 'phone', 'cpf', 'avatarUrl', 'createdAt', 'updatedAt',
  ]);

  const addresses = await prisma.address.findMany();
  out += buildInserts('Address', addresses, [
    'id', 'userId', 'street', 'number', 'complement', 'neighborhood',
    'city', 'state', 'zipCode', 'isDefault', 'createdAt', 'updatedAt',
  ]);

  const categories = await prisma.category.findMany();
  out += buildInserts('Category', categories, [
    'id', 'name', 'slug', 'description', 'imageUrl', 'displayOrder', 'active', 'createdAt', 'updatedAt',
  ]);

  const products = await prisma.product.findMany();
  out += buildInserts('Product', products, [
    'id', 'name', 'slug', 'sku', 'description', 'shortDescription', 'price',
    'originalPrice', 'discountPercent', 'stock', 'active', 'featured', 'isNew',
    'rating', 'reviewsCount', 'materials', 'dimensions', 'weightKg', 'categoryId',
    'createdAt', 'updatedAt',
  ]);

  const productImages = await prisma.productImage.findMany();
  out += buildInserts('ProductImage', productImages, [
    'id', 'productId', 'url', 'alt', 'displayOrder', 'isCover', 'createdAt',
  ]);

  const productVariants = await prisma.productVariant.findMany();
  out += buildInserts('ProductVariant', productVariants, [
    'id', 'productId', 'name', 'colorName', 'colorHex', 'sku', 'stock', 'priceAdjustment', 'createdAt',
  ]);

  const orders = await prisma.order.findMany();
  out += buildInserts('Order', orders, [
    'id', 'orderNumber', 'userId', 'guestName', 'guestEmail', 'guestPhone', 'guestCpf',
    'status', 'paymentMethod', 'paymentStatus', 'subtotal', 'discount', 'shippingCost',
    'total', 'trackingCode', 'carrierName', 'shippingService', 'couponCode',
    'shippingAddress', 'addressId', 'notes', 'createdAt', 'updatedAt',
  ]);

  const orderItems = await prisma.orderItem.findMany();
  out += buildInserts('OrderItem', orderItems, [
    'id', 'orderId', 'productId', 'variantId', 'productName', 'productImage',
    'variantName', 'price', 'quantity', 'total',
  ]);

  const orderStatusHistory = await prisma.orderStatusHistory.findMany();
  out += buildInserts('OrderStatusHistory', orderStatusHistory, [
    'id', 'orderId', 'status', 'note', 'createdAt',
  ]);

  const payments = await prisma.payment.findMany();
  out += buildInserts('Payment', payments, [
    'id', 'orderId', 'paymentMethod', 'status', 'transactionId', 'qrCode',
    'qrCodeBase64', 'copyPastePix', 'installments', 'cardLastFour', 'cardBrand',
    'amount', 'paidAt', 'rawResponse', 'createdAt', 'updatedAt',
  ]);

  const reviews = await prisma.review.findMany();
  out += buildInserts('Review', reviews, [
    'id', 'productId', 'userId', 'userName', 'userAvatar', 'rating',
    'title', 'comment', 'verifiedPurchase', 'active', 'createdAt',
  ]);

  const favorites = await prisma.favorite.findMany();
  out += buildInserts('Favorite', favorites, [
    'id', 'userId', 'productId', 'createdAt',
  ]);

  out += `
-- 6. Verificação final dos dados inseridos no Supabase
SELECT
  (SELECT count(*) FROM "Category") AS categories_count,
  (SELECT count(*) FROM "Product") AS products_count,
  (SELECT count(*) FROM "ProductImage") AS images_count,
  (SELECT count(*) FROM "ProductVariant") AS variants_count,
  (SELECT count(*) FROM "User") AS users_count,
  (SELECT count(*) FROM "Order") AS orders_count,
  current_user AS executed_as;
`;

  const outPath = path.join(__dirname, '..', 'prisma', 'full-supabase-setup.sql');
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`Arquivo SQL completo gerado com sucesso em: ${outPath}`);
  console.log(`Resumo: ${categories.length} categorias, ${products.length} produtos, ${productImages.length} imagens, ${productVariants.length} variantes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

