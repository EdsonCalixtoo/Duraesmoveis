const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dns = require('dns').promises;

const CANDIDATE_URLS = [
  {
    label: 'Supabase Pooler AWS-0 (duraes_admin :6543)',
    dbUrl: 'postgresql://duraes_admin.wsyskajeudzjffkihciz:DuraesMoveis2026DbPass@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
    directUrl: 'postgresql://duraes_admin:DuraesMoveis2026DbPass@db.wsyskajeudzjffkihciz.supabase.co:5432/postgres',
  },
  {
    label: 'Supabase Pooler AWS-0 (duraes_admin :5432)',
    dbUrl: 'postgresql://duraes_admin.wsyskajeudzjffkihciz:DuraesMoveis2026DbPass@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    directUrl: 'postgresql://duraes_admin:DuraesMoveis2026DbPass@db.wsyskajeudzjffkihciz.supabase.co:5432/postgres',
  },
  {
    label: 'Supabase Direct DB (duraes_admin :5432)',
    dbUrl: 'postgresql://duraes_admin:DuraesMoveis2026DbPass@db.wsyskajeudzjffkihciz.supabase.co:5432/postgres',
    directUrl: 'postgresql://duraes_admin:DuraesMoveis2026DbPass@db.wsyskajeudzjffkihciz.supabase.co:5432/postgres',
  },
];

async function findWorkingConnection() {
  try {
    const ipv4 = await dns.resolve4('db.wsyskajeudzjffkihciz.supabase.co').catch(() => []);
    const ipv6 = await dns.resolve6('db.wsyskajeudzjffkihciz.supabase.co').catch(() => []);
    console.log(`🌐 DNS db.wsyskajeudzjffkihciz.supabase.co -> IPv4: ${JSON.stringify(ipv4)} | IPv6: ${JSON.stringify(ipv6)}`);
  } catch {}
  for (const candidate of CANDIDATE_URLS) {
    const client = new PrismaClient({
      datasources: { db: { url: candidate.dbUrl } },
    });
    try {
      await client.category.count();
      console.log(`✅ Conexão estabelecida via: ${candidate.label}`);
      // Atualizar .env e src/lib/prisma.ts com a URL validada
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/DATABASE_URL="[^"]*"/, `DATABASE_URL="${candidate.dbUrl}"`);
        envContent = envContent.replace(/DIRECT_URL="[^"]*"/, `DIRECT_URL="${candidate.directUrl}"`);
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
      const prismaLibPath = path.join(__dirname, '..', 'src', 'lib', 'prisma.ts');
      if (fs.existsSync(prismaLibPath)) {
        let libContent = fs.readFileSync(prismaLibPath, 'utf8');
        libContent = libContent.replace(
          /const DEFAULT_SUPABASE_DB_URL =\s*'[^']+';/,
          `const DEFAULT_SUPABASE_DB_URL =\n  '${candidate.dbUrl}';`
        );
        fs.writeFileSync(prismaLibPath, libContent, 'utf8');
      }
      return client;
    } catch (err) {
      console.log(`ℹ️ Tentativa (${candidate.label}): ${err.message.split('\n').pop()}`);
      await client.$disconnect().catch(() => {});
    }
  }
  throw new Error('Nenhuma das URLs candidatas conseguiu conectar ao Supabase PostgreSQL.');
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 INICIANDO SUÍTE DE TESTES AUTOMATIZADOS - DURÃES MÓVEIS (SUPABASE)');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  let prisma;
  try {
    prisma = await findWorkingConnection();

    // 1. Teste de Conexão com o Banco de Dados e Categorias
    console.log('\nTESTE 1: Banco de Dados Supabase e Categorias');
    const categoriesCount = await prisma.category.count();
    assert(categoriesCount >= 6, `Categorias cadastradas no Supabase: ${categoriesCount} (esperado >= 6)`);

    const productsCount = await prisma.product.count();
    assert(productsCount >= 15, `Produtos reais cadastrados no Supabase: ${productsCount} (esperado >= 15)`);

    // 2. Teste de Produtos e Variantes
    console.log('\nTESTE 2: Catálogo de Produtos e Imagens');
    const sofaRiviera = await prisma.product.findUnique({
      where: { slug: 'sofa-externo-riviera-3-lugares' },
      include: { variants: true, images: true, category: true },
    });
    assert(sofaRiviera !== null, 'Produto "Sofá Externo Riviera" existe no Supabase');
    assert(sofaRiviera && sofaRiviera.price === 5391.0, `Preço do Riviera: R$ ${sofaRiviera?.price} (esperado R$ 5391.00)`);
    assert(sofaRiviera && sofaRiviera.variants.length >= 4, `Variantes de cores: ${sofaRiviera?.variants.length} (esperado >= 4)`);
    assert(sofaRiviera && sofaRiviera.images.length >= 4, `Galeria de imagens: ${sofaRiviera?.images.length} (esperado >= 4)`);

    // 3. Teste de Autenticação e Hash de Senhas
    console.log('\nTESTE 3: Autenticação Segura (Bcrypt & Roles)');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@outdoorstyle.com.br' },
    });
    assert(adminUser !== null, 'Usuário Admin existe no Supabase');
    assert(adminUser?.role === 'ADMIN', 'Usuário Admin possui role ADMIN');
    const isAdminPasswordValid = await bcrypt.compare('admin123456', adminUser?.passwordHash || '');
    assert(isAdminPasswordValid, 'Senha do Admin confere com hash bcrypt');

    const customerUser = await prisma.user.findUnique({
      where: { email: 'edson@outdoorstyle.com.br' },
    });
    assert(customerUser !== null, 'Usuário Cliente "Edson Silva" existe no Supabase');
    const isCustomerPasswordValid = await bcrypt.compare('cliente123', customerUser?.passwordHash || '');
    assert(isCustomerPasswordValid, 'Senha do Cliente confere com hash bcrypt');

    // 4. Teste do Pedido #EXM-10234
    console.log('\nTESTE 4: Pedido #EXM-10234 e Stepper');
    const orderExm = await prisma.order.findUnique({
      where: { orderNumber: 'EXM-10234' },
      include: { items: true, payment: true },
    });
    assert(orderExm !== null, 'Pedido #EXM-10234 localizado no Supabase');
    assert(orderExm?.status === 'IN_TRANSIT', `Status do pedido: ${orderExm?.status} (esperado IN_TRANSIT)`);
    assert(orderExm?.total === 6015.0, `Valor total do pedido: R$ ${orderExm?.total} (esperado R$ 6015.00)`);
    assert(orderExm?.items.length === 2, `Quantidade de itens: ${orderExm?.items.length} (esperado 2)`);
    assert(orderExm?.payment?.paymentMethod === 'PIX', 'Forma de pagamento confirmada: PIX');

    // 5. Teste de Cupons de Desconto, Banners, Endereços e Configurações
    console.log('\nTESTE 5: Cupons, Banners, Endereços, Favoritos e Configurações no Supabase');
    const coupon = await prisma.coupon.findUnique({
      where: { code: 'BEMVINDO10' },
    });
    assert(coupon !== null, 'Cupom BEMVINDO10 cadastrado no Supabase');
    assert(coupon?.discountValue === 10, 'Valor do desconto é 10%');

    const storeSettingsCount = await prisma.storeSetting.count();
    assert(storeSettingsCount >= 9, `Configurações da loja no Supabase: ${storeSettingsCount} (esperado >= 9)`);

    const bannersCount = await prisma.banner.count();
    assert(bannersCount >= 2, `Banners cadastrados no Supabase: ${bannersCount} (esperado >= 2)`);

    const addressesCount = await prisma.address.count();
    assert(addressesCount >= 1, `Endereços de clientes no Supabase: ${addressesCount} (esperado >= 1)`);

    const reviewsCount = await prisma.review.count();
    assert(reviewsCount >= 3, `Avaliações de produtos no Supabase: ${reviewsCount} (esperado >= 3)`);

    // 6. Teste de Consistência de Estoque em Transação
    console.log('\nTESTE 6: Transação e Baixa de Estoque no PostgreSQL');
    const initialStock = sofaRiviera?.stock || 0;
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: sofaRiviera.id },
        data: { stock: { decrement: 1 } },
      });
    });
    const updatedStockProd = await prisma.product.findUnique({
      where: { id: sofaRiviera.id },
    });
    assert(updatedStockProd?.stock === initialStock - 1, 'Estoque decrementado corretamente na transação PostgreSQL');
    // Restaurar estoque
    await prisma.product.update({
      where: { id: sofaRiviera.id },
      data: { stock: initialStock },
    });

    console.log('\n====================================================');
    console.log(`📊 RESULTADO DOS TESTES: ${passed} PASSOU | ${failed} FALHOU`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro na execução dos testes:', error);
    process.exit(1);
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}

runTests();
