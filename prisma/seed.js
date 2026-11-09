const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados OutdoorStyle...');

  // Limpar dados anteriores
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 1. Configurações da Loja
  console.log('Criando configurações da loja...');
  await prisma.storeSetting.createMany({
    data: [
      { key: 'STORE_NAME', value: 'OutdoorStyle', description: 'Nome da loja' },
      { key: 'STORE_TAGLINE', value: 'Móveis Externos Premium', description: 'Slogan da loja' },
      { key: 'STORE_PHONE', value: '(19) 4000-1234', description: 'Telefone comercial' },
      { key: 'STORE_WHATSAPP', value: '551940001234', description: 'WhatsApp oficial' },
      { key: 'STORE_EMAIL', value: 'contato@outdoorstyle.com.br', description: 'E-mail de atendimento' },
      { key: 'STORE_ADDRESS', value: 'Av. Norte-Sul, 1234 - Taquaral, Campinas - SP', description: 'Endereço físico' },
      { key: 'FREE_SHIPPING_THRESHOLD', value: '2999', description: 'Valor mínimo para frete grátis' },
      { key: 'PIX_DISCOUNT_PERCENT', value: '5', description: 'Desconto à vista no Pix (%)' },
      { key: 'MAX_INSTALLMENTS', value: '12', description: 'Número máximo de parcelas sem juros' },
    ],
  });

  // 2. Usuários
  console.log('Criando usuários...');
  const adminPasswordHash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador OutdoorStyle',
      email: 'admin@outdoorstyle.com.br',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '(19) 99000-1111',
      cpf: '000.000.000-00',
    },
  });

  const customerPasswordHash = await bcrypt.hash('cliente123', 10);
  const customer = await prisma.user.create({
    data: {
      name: 'Edson Silva',
      email: 'edson@outdoorstyle.com.br',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '(19) 99876-5432',
      cpf: '123.456.789-00',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  // Endereço do cliente Edson
  const edsonAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      street: 'Av. Barão de Itapura',
      number: '1234',
      complement: 'Apto 42',
      neighborhood: 'Guanabara',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13020-432',
      isDefault: true,
    },
  });

  // 3. Categorias
  console.log('Criando categorias...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Poltronas',
        slug: 'poltronas',
        description: 'Poltronas para jardim, varanda e piscinas com estrutura em alumínio e corda náutica.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
        displayOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mesas e Cadeiras',
        slug: 'mesas-e-cadeiras',
        description: 'Conjuntos de jantar e mesas para áreas externas com tampos em madeira teca e vidro temperado.',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
        displayOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Espreguiçadeiras',
        slug: 'espreguicadeiras',
        description: 'Espreguiçadeiras reclináveis para borda de piscina e decks, com tecido sling e almofadas náuticas.',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
        displayOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sofás Externos',
        slug: 'sofas-externos',
        description: 'Sofás modulares e de 2 a 4 lugares com estofados impermeáveis e acabamento de alto padrão.',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
        displayOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Guarda-Sóis',
        slug: 'guarda-sois',
        description: 'Guarda-sóis laterais e centrais com estrutura em alumínio giratório 360° e proteção solar UV 50+.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        displayOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Acessórios',
        slug: 'acessorios',
        description: 'Lareiras de jardim, capas protetoras, luminárias solares e almofadas decorativas impermeáveis.',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
        displayOrder: 6,
      },
    }),
  ]);

  const catMap = {};
  categories.forEach((cat) => {
    catMap[cat.slug] = cat.id;
  });

  // 4. Produtos com Imagens e Variantes
  console.log('Criando produtos e variantes...');

  // Produto 1: Sofá Externo Riviera 3 Lugares (Destaque da tela 03)
  const sofaRiviera = await prisma.product.create({
    data: {
      name: 'Sofá Externo Riviera 3 Lugares',
      slug: 'sofa-externo-riviera-3-lugares',
      sku: 'SOF-RIV-003',
      categoryId: catMap['sofas-externos'],
      description: 'O Sofá Externo Riviera 3 Lugares une arquitetura contemporânea e máxima durabilidade para áreas de lazer sofisticadas. Fabricado com estrutura 100% em alumínio de parede espessa com pintura eletrostática a pó, possui trama artesanal em corda náutica com tratamento UV e estofamento em espuma D-33 revestida em tecido impermeável Sunbrella, resistente à água, cloro e sol forte.',
      shortDescription: 'Sofá externo com estrutura em alumínio nobre, fibra sintética e almofadas impermeáveis. Ideal para varandas, jardim e áreas de piscina.',
      price: 5391.00,
      originalPrice: 5990.00,
      discountPercent: 10,
      stock: 14,
      active: true,
      featured: true,
      isNew: true,
      rating: 4.9,
      reviewsCount: 92,
      materials: 'Alumínio estrutural eletrostático, Corda náutica UV, Tecido Sunbrella impermeável',
      dimensions: '220 cm (L) x 85 cm (P) x 68 cm (A)',
      weightKg: 34.5,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Externo Riviera 3 Lugares - Vista Principal Jardim',
            displayOrder: 1,
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Externo Riviera 3 Lugares - Detalhe da Trama Náutica',
            displayOrder: 2,
          },
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Externo Riviera 3 Lugares - Almofadas Impermeáveis',
            displayOrder: 3,
          },
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Externo Riviera 3 Lugares - Vista Noturna Deck Iluminado',
            displayOrder: 4,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Taupe', colorName: 'Taupe', colorHex: '#8C7A6B', stock: 6, sku: 'SOF-RIV-003-TAU' },
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 4, sku: 'SOF-RIV-003-GRA' },
          { name: 'Bege Areia', colorName: 'Bege Areia', colorHex: '#D1C7BD', stock: 3, sku: 'SOF-RIV-003-BEG' },
          { name: 'Marrom Canela', colorName: 'Marrom Canela', colorHex: '#5B3A29', stock: 1, sku: 'SOF-RIV-003-MAR' },
        ],
      },
    },
    include: { variants: true },
  });

  // Produto 2: Sofá Modular Cayenne 4 Lugares
  const sofaCayenne = await prisma.product.create({
    data: {
      name: 'Sofá Modular Cayenne 4 Lugares',
      slug: 'sofa-modular-cayenne-4-lugares',
      sku: 'SOF-CAY-004',
      categoryId: catMap['sofas-externos'],
      description: 'Módulos versáteis que se adaptam perfeitamente a varandas gourmet e decks ao redor da piscina. Estrutura robusta em madeira teca certificada combinada com pés em alumínio anodizado fosco.',
      shortDescription: 'Design modular sofisticado, perfeito para receber amigos e família em áreas abertas.',
      price: 7898.00,
      originalPrice: 8975.00,
      discountPercent: 12,
      stock: 8,
      active: true,
      featured: true,
      isNew: true,
      rating: 5.0,
      reviewsCount: 18,
      materials: 'Madeira Teca FSC, Alumínio preto fosco, Tecido náutico repelente',
      dimensions: '290 cm (L) x 90 cm (P) x 70 cm (A)',
      weightKg: 52.0,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Modular Cayenne 4 Lugares',
            displayOrder: 1,
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Modular Cayenne Ambiente Externo',
            displayOrder: 2,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 5, sku: 'SOF-CAY-004-GRA' },
          { name: 'Off-White', colorName: 'Off-White', colorHex: '#F0ECE1', stock: 3, sku: 'SOF-CAY-004-OFF' },
        ],
      },
    },
    include: { variants: true },
  });

  // Produto 3: Sofá Firenze 2 Lugares
  await prisma.product.create({
    data: {
      name: 'Sofá Firenze 2 Lugares',
      slug: 'sofa-firenze-2-lugares',
      sku: 'SOF-FIR-002',
      categoryId: catMap['sofas-externos'],
      description: 'Ideal para sacadas e espaços compactos que não abrem mão do luxo e do conforto ergonômico.',
      shortDescription: 'Proporções equilibradas e acabamento impecável em fibra sintética de alta densidade.',
      price: 4303.20,
      originalPrice: 4790.00,
      discountPercent: 10,
      stock: 12,
      active: true,
      featured: true,
      rating: 4.8,
      reviewsCount: 37,
      materials: 'Fibra sintética virgem anti-ressecamento, Alumínio, Espuma D-30',
      dimensions: '160 cm (L) x 80 cm (P) x 72 cm (A)',
      weightKg: 22.0,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Firenze 2 Lugares',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Taupe', colorName: 'Taupe', colorHex: '#8C7A6B', stock: 8, sku: 'SOF-FIR-002-TAU' },
          { name: 'Bege', colorName: 'Bege', colorHex: '#D1C7BD', stock: 4, sku: 'SOF-FIR-002-BEG' },
        ],
      },
    },
  });

  // Produto 4: Sofá Outdoor Maré 3 Lugares
  await prisma.product.create({
    data: {
      name: 'Sofá Outdoor Maré 3 Lugares',
      slug: 'sofa-outdoor-mare-3-lugares',
      sku: 'SOF-MAR-003',
      categoryId: catMap['sofas-externos'],
      description: 'Linhas orgânicas inspiradas no movimento das ondas. Proporciona relaxamento sem precedentes.',
      shortDescription: 'Linhas suaves e design moderno que valorizam qualquer área externa.',
      price: 6090.00,
      originalPrice: 6790.00,
      discountPercent: 10,
      stock: 7,
      active: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 14,
      materials: 'Corda náutica tricotada, Alumínio naval, Tecido poliéster naval',
      dimensions: '210 cm (L) x 85 cm (P) x 75 cm (A)',
      weightKg: 31.0,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            alt: 'Sofá Outdoor Maré 3 Lugares',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 4, sku: 'SOF-MAR-003-GRA' },
          { name: 'Cinza Névoa', colorName: 'Cinza Névoa', colorHex: '#9E9E9E', stock: 3, sku: 'SOF-MAR-003-CIN' },
        ],
      },
    },
  });

  // Produto 5: Poltrona de Fibra Sintética Premium
  await prisma.product.create({
    data: {
      name: 'Poltrona de Fibra Sintética Premium',
      slug: 'poltrona-de-fibra-sintetica-premium',
      sku: 'POL-FIB-001',
      categoryId: catMap['poltronas'],
      description: 'Aconchegante e envolvente, a Poltrona Premium possui almofada lombar e assento extra macio.',
      shortDescription: 'Poltrona individual ergonômica com fibra sintética trançada artesanalmente.',
      price: 1199.00,
      originalPrice: 1499.00,
      discountPercent: 20,
      stock: 20,
      active: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 54,
      materials: 'Fibra sintética marrom acobreado, Alumínio estrutural',
      dimensions: '82 cm (L) x 80 cm (P) x 78 cm (A)',
      weightKg: 11.5,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
            alt: 'Poltrona de Fibra Sintética Premium',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Café', colorName: 'Café', colorHex: '#3D2817', stock: 12, sku: 'POL-FIB-001-CAF' },
          { name: 'Palha', colorName: 'Palha', colorHex: '#C5A880', stock: 8, sku: 'POL-FIB-001-PAL' },
        ],
      },
    },
  });

  // Produto 6: Conjunto Mesa e Cadeiras para Jardim
  await prisma.product.create({
    data: {
      name: 'Conjunto Mesa e Cadeiras para Jardim',
      slug: 'conjunto-mesa-e-cadeiras-para-jardim',
      sku: 'CON-MES-006',
      categoryId: catMap['mesas-e-cadeiras'],
      description: 'Mesa retangular com 6 cadeiras ergonômicas para refeições ao ar livre inesquecíveis.',
      shortDescription: 'Mesa de jantar externa de 6 lugares com cadeiras leves e empilháveis.',
      price: 2124.00,
      originalPrice: 2499.00,
      discountPercent: 15,
      stock: 9,
      active: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 31,
      materials: 'Alumínio fosco, Vidro temperado serigrafado, Tela sling',
      dimensions: 'Mesa: 180cm x 90cm x 75cm / Cadeira: 56cm x 60cm x 88cm',
      weightKg: 48.0,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
            alt: 'Conjunto Mesa e Cadeiras para Jardim',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 5, sku: 'CON-MES-006-GRA' },
          { name: 'Branco', colorName: 'Branco', colorHex: '#FFFFFF', stock: 4, sku: 'CON-MES-006-BRA' },
        ],
      },
    },
  });

  // Produto 7: Espreguiçadeira Alumínio com Tela Sling
  await prisma.product.create({
    data: {
      name: 'Espreguiçadeira Alumínio com Tela Sling',
      slug: 'espreguicadeira-aluminio-com-tela-sling',
      sku: 'ESP-SLI-001',
      categoryId: catMap['espreguicadeiras'],
      description: 'Prática, leve e ultrarresistente. Possui 5 posições de reclinação e rodízios embutidos para fácil locomoção.',
      shortDescription: 'Espreguiçadeira com regulagem de 5 posições e secagem ultrarrápida.',
      price: 1490.00,
      originalPrice: 1990.00,
      discountPercent: 25,
      stock: 16,
      active: true,
      featured: true,
      rating: 4.8,
      reviewsCount: 29,
      materials: 'Alumínio eletrostático, Tela sling respirável antibacteriana',
      dimensions: '195 cm (C) x 65 cm (L) x 35 cm (A)',
      weightKg: 8.5,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
            alt: 'Espreguiçadeira Alumínio com Tela Sling',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 10, sku: 'ESP-SLI-001-GRA' },
          { name: 'Azul Marinho', colorName: 'Azul Marinho', colorHex: '#1B2A4A', stock: 6, sku: 'ESP-SLI-001-AZU' },
        ],
      },
    },
  });

  // Produto 8: Guarda-Sol Lateral Ø 3m (Presente no carrinho do card 04 e pedido do card 08)
  const guardaSul = await prisma.product.create({
    data: {
      name: 'Guarda-Sol Lateral Ø 3m',
      slug: 'guarda-sol-lateral-3m',
      sku: 'GUA-LAT-003',
      categoryId: catMap['guarda-sois'],
      description: 'Guarda-sol articulado com haste lateral reforçada em alumínio e manivela suave de abertura. Base com suporte de fixação e tecido com fator de proteção UPF 50+ contra raios ultravioleta.',
      shortDescription: 'Guarda-sol lateral giratório 360 graus com manivela de fácil manuseio e proteção UV.',
      price: 624.00,
      originalPrice: 780.00,
      discountPercent: 20,
      stock: 25,
      active: true,
      featured: true,
      rating: 4.8,
      reviewsCount: 63,
      materials: 'Haste em alumínio anodizado, Cobertura em poliéster hidro-repelente 250g',
      dimensions: 'Diâmetro 300 cm x Altura 250 cm',
      weightKg: 18.0,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            alt: 'Guarda-Sol Lateral Ø 3m',
            displayOrder: 1,
            isCover: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Bege', colorName: 'Bege', colorHex: '#D1C7BD', stock: 15, sku: 'GUA-LAT-003-BEG' },
          { name: 'Grafite', colorName: 'Grafite', colorHex: '#2B2B2B', stock: 10, sku: 'GUA-LAT-003-GRA' },
        ],
      },
    },
    include: { variants: true },
  });

  // 5. Banners Principais
  console.log('Criando banners...');
  await prisma.banner.createMany({
    data: [
      {
        title: 'Transforme seu espaço externo',
        highlightText: 'em um ambiente incrível!',
        subtitle: 'Móveis externos com design moderno, qualidade premium e conforto incomparável.',
        buttonText: 'Ver Coleção Completa',
        buttonLink: '/catalogo',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
        active: true,
        displayOrder: 1,
        position: 'HERO',
      },
      {
        title: 'Linha Riviera & Resort 2026',
        highlightText: 'Durabilidade que Impressiona',
        subtitle: 'Estruturas em alumínio naval e cordas náuticas com 5 anos de garantia de fábrica.',
        buttonText: 'Conhecer Linha Náutica',
        buttonLink: '/categoria/sofas-externos',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1920&q=80',
        active: true,
        displayOrder: 2,
        position: 'HERO',
      },
    ],
  });

  // 6. Cupons de Desconto
  console.log('Criando cupons...');
  await prisma.coupon.createMany({
    data: [
      {
        code: 'BEMVINDO10',
        description: '10% de desconto na primeira compra',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 500,
        maxUses: 1000,
        active: true,
      },
      {
        code: 'OUTDOOR15',
        description: '15% de desconto especial em móveis externos',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minOrderValue: 2000,
        maxUses: 500,
        active: true,
      },
      {
        code: 'VERAO500',
        description: 'R$ 500 OFF em compras acima de R$ 5.000',
        discountType: 'FIXED',
        discountValue: 500,
        minOrderValue: 5000,
        maxUses: 200,
        active: true,
      },
    ],
  });

  // 7. Pedido demonstrativo #EXM-10234 (exatamente como nas telas 04 e 08!)
  console.log('Criando pedido demonstrativo #EXM-10234...');
  const taupeVariant = sofaRiviera.variants.find((v) => v.colorName === 'Taupe');
  const beigeGuardaSol = guardaSul.variants.find((v) => v.colorName === 'Bege');

  const orderExm = await prisma.order.create({
    data: {
      orderNumber: 'EXM-10234',
      userId: customer.id,
      guestName: customer.name,
      guestEmail: customer.email,
      guestPhone: customer.phone,
      guestCpf: customer.cpf,
      status: 'IN_TRANSIT',
      paymentMethod: 'PIX',
      paymentStatus: 'APPROVED',
      subtotal: 6015.00,
      discount: 0.00,
      shippingCost: 0.00,
      total: 6015.00,
      trackingCode: 'BR-EXP-98741203',
      carrierName: 'Transportadora Especializada Outdoor',
      shippingService: 'Entrega Expressa Especial (Móveis Montados)',
      shippingAddress: JSON.stringify({
        street: 'Av. Barão de Itapura',
        number: '1234',
        complement: 'Apto 42',
        neighborhood: 'Guanabara',
        city: 'Campinas',
        state: 'SP',
        zipCode: '13020-432',
      }),
      addressId: edsonAddress.id,
      notes: 'Entregar na portaria social e acionar interfone.',
      createdAt: new Date('2026-11-08T14:32:00.000Z'),
      items: {
        create: [
          {
            productId: sofaRiviera.id,
            variantId: taupeVariant ? taupeVariant.id : null,
            productName: 'Sofá Externo Riviera 3 Lugares',
            productImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
            variantName: 'Cor: Taupe',
            price: 5391.00,
            quantity: 1,
            total: 5391.00,
          },
          {
            productId: guardaSul.id,
            variantId: beigeGuardaSol ? beigeGuardaSol.id : null,
            productName: 'Guarda-Sol Lateral Ø 3m',
            productImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
            variantName: 'Cor: Bege',
            price: 624.00,
            quantity: 1,
            total: 624.00,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Pedido recebido com sucesso', createdAt: new Date('2026-11-08T14:32:00.000Z') },
          { status: 'PAID', note: 'Pagamento Pix aprovado instantaneamente via Mercado Pago', createdAt: new Date('2026-11-08T14:33:15.000Z') },
          { status: 'IN_TRANSIT', note: 'Carga coletada e em transferência para o centro logístico de Campinas', createdAt: new Date('2026-11-09T08:15:00.000Z') },
        ],
      },
      payment: {
        create: {
          paymentMethod: 'PIX',
          status: 'APPROVED',
          transactionId: 'MP-PIX-9821839218',
          copyPastePix: '00020126580014br.gov.bcb.pix0136outdoorstyle-pix-key-928152040000530398654066015.005802BR5912OutdoorStyle6008Campinas62070503***6304E8A1',
          amount: 6015.00,
          paidAt: new Date('2026-11-08T14:33:15.000Z'),
        },
      },
    },
  });

  // Outros pedidos para enriquecer o painel administrativo
  await prisma.order.create({
    data: {
      orderNumber: 'EXM-10235',
      userId: customer.id,
      guestName: 'Carla Vasconcellos',
      guestEmail: 'carla.v@gmail.com',
      guestPhone: '(11) 98765-1122',
      guestCpf: '234.567.890-11',
      status: 'PAID',
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'APPROVED',
      subtotal: 7898.00,
      discount: 0.00,
      shippingCost: 0.00,
      total: 7898.00,
      shippingAddress: JSON.stringify({
        street: 'Rua Oscar Freire',
        number: '890',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01426-001',
      }),
      createdAt: new Date('2026-11-09T10:14:00.000Z'),
      items: {
        create: [
          {
            productId: sofaCayenne.id,
            productName: 'Sofá Modular Cayenne 4 Lugares',
            productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
            variantName: 'Cor: Grafite',
            price: 7898.00,
            quantity: 1,
            total: 7898.00,
          },
        ],
      },
    },
  });

  // 8. Favoritos do usuário Edson
  console.log('Criando favoritos...');
  await prisma.favorite.createMany({
    data: [
      { userId: customer.id, productId: sofaRiviera.id },
      { userId: customer.id, productId: guardaSul.id },
    ],
  });

  // 9. Avaliações
  console.log('Criando avaliações...');
  await prisma.review.createMany({
    data: [
      {
        productId: sofaRiviera.id,
        userId: customer.id,
        userName: 'Edson Silva',
        rating: 5,
        title: 'Qualidade excepcional!',
        comment: 'O sofá é simplesmente espetacular! O acabamento da corda náutica e o toque do tecido impermeável são impecáveis. Tomou chuva e secou super rápido.',
        verifiedPurchase: true,
      },
      {
        productId: sofaRiviera.id,
        userName: 'Mariana Duarte',
        rating: 5,
        title: 'Elegante e muito confortável',
        comment: 'Comprei para a varanda integrada com a piscina. Superou todas as expectativas da família. A entrega com a equipe própria foi muito cuidadosa.',
        verifiedPurchase: true,
      },
      {
        productId: sofaRiviera.id,
        userName: 'Ricardo Almeida',
        rating: 5,
        title: 'Vale cada centavo',
        comment: 'Estrutura muito firme em alumínio e cor Taupe maravilhosa ao vivo. Recomendo de olhos fechados.',
        verifiedPurchase: true,
      },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
