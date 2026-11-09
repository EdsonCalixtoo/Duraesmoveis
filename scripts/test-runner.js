const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('🧪 INICIANDO SUÍTE DE TESTES AUTOMATIZADOS - OUTDOORSTYLE');
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

  try {
    // 1. Teste de Conexão com o Banco de Dados e Categorias
    console.log('TESTE 1: Banco de Dados e Categorias');
    const categoriesCount = await prisma.category.count();
    assert(categoriesCount >= 6, `Categorias cadastradas: ${categoriesCount} (esperado >= 6)`);

    // 2. Teste de Produtos e Variantes
    console.log('\nTESTE 2: Catálogo de Produtos e Imagens');
    const sofaRiviera = await prisma.product.findUnique({
      where: { slug: 'sofa-externo-riviera-3-lugares' },
      include: { variants: true, images: true, category: true },
    });
    assert(sofaRiviera !== null, 'Produto "Sofá Externo Riviera" existe no banco');
    assert(sofaRiviera && sofaRiviera.price === 5391.0, `Preço do Riviera: R$ ${sofaRiviera?.price} (esperado R$ 5391.00)`);
    assert(sofaRiviera && sofaRiviera.variants.length >= 4, `Variantes de cores: ${sofaRiviera?.variants.length} (esperado >= 4)`);
    assert(sofaRiviera && sofaRiviera.images.length >= 4, `Galeria de imagens: ${sofaRiviera?.images.length} (esperado >= 4)`);

    // 3. Teste de Autenticação e Hash de Senhas
    console.log('\nTESTE 3: Autenticação Segura (Bcrypt & Roles)');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@outdoorstyle.com.br' },
    });
    assert(adminUser !== null, 'Usuário Admin existe');
    assert(adminUser?.role === 'ADMIN', 'Usuário Admin possui role ADMIN');
    const isAdminPasswordValid = await bcrypt.compare('admin123456', adminUser?.passwordHash || '');
    assert(isAdminPasswordValid, 'Senha do Admin confere com hash bcrypt');

    const customerUser = await prisma.user.findUnique({
      where: { email: 'edson@outdoorstyle.com.br' },
    });
    assert(customerUser !== null, 'Usuário Cliente "Edson Silva" existe');
    const isCustomerPasswordValid = await bcrypt.compare('cliente123', customerUser?.passwordHash || '');
    assert(isCustomerPasswordValid, 'Senha do Cliente confere com hash bcrypt');

    // 4. Teste do Pedido #EXM-10234 (Mockup Tela 08)
    console.log('\nTESTE 4: Pedido Demonstrativo #EXM-10234 e Stepper');
    const orderExm = await prisma.order.findUnique({
      where: { orderNumber: 'EXM-10234' },
      include: { items: true, payment: true },
    });
    assert(orderExm !== null, 'Pedido #EXM-10234 localizado no sistema');
    assert(orderExm?.status === 'IN_TRANSIT', `Status do pedido: ${orderExm?.status} (esperado IN_TRANSIT)`);
    assert(orderExm?.total === 6015.0, `Valor total do pedido: R$ ${orderExm?.total} (esperado R$ 6015.00)`);
    assert(orderExm?.items.length === 2, `Quantidade de itens: ${orderExm?.items.length} (esperado 2)`);
    assert(orderExm?.payment?.paymentMethod === 'PIX', 'Forma de pagamento confirmada: PIX');

    // 5. Teste de Cupons de Desconto
    console.log('\nTESTE 5: Sistema de Cupons e Descontos');
    const coupon = await prisma.coupon.findUnique({
      where: { code: 'BEMVINDO10' },
    });
    assert(coupon !== null, 'Cupom BEMVINDO10 cadastrado');
    assert(coupon?.discountValue === 10, 'Valor do desconto é 10%');

    // 6. Teste de Consistência de Estoque em Transação
    console.log('\nTESTE 6: Transação e Baixa de Estoque');
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
    assert(updatedStockProd?.stock === initialStock - 1, 'Estoque decrementado corretamente na transação');
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
    await prisma.$disconnect();
  }
}

runTests();
