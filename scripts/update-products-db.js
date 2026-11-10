const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Atualizando banco de dados com fotos reais da Durães Móveis...');

  const cats = await prisma.category.findMany();
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c.id; });

  console.log('Categorias encontradas:', Object.keys(catMap));

  // 1. Atualizar Ombrelone Lateral com Base Floreira
  const ombrelone = await prisma.product.findFirst({
    where: { OR: [{ slug: 'guarda-sol-lateral-3m' }, { sku: 'GUA-LAT-003' }, { sku: 'OMB-LAT-003' }] }
  });

  if (ombrelone) {
    console.log('Atualizando Ombrelone Lateral...');
    await prisma.productImage.deleteMany({ where: { productId: ombrelone.id } });
    await prisma.productVariant.deleteMany({ where: { productId: ombrelone.id } });

    await prisma.product.update({
      where: { id: ombrelone.id },
      data: {
        name: 'Ombrelone Lateral Articulado com Base Floreira em Madeira Nobre',
        slug: 'ombrelone-lateral-articulado-base-floreira-madeira',
        sku: 'OMB-LAT-003',
        description: 'O Ombrelone Lateral Articulado Durães Móveis é o ápice da sofisticação e funcionalidade para áreas externas de alto padrão. Com estrutura robusta em madeira nobre tratada contra intempéries e acabamento naval, possui sistema de articulação suave e cobertura em tecido hidrorrepelente com proteção UV50+. Sua base exclusiva com floreira em madeira maciça garante estabilidade máxima contra ventos sem abrir mão da estética natural.',
        shortDescription: 'Ombrelone articulado 3m em madeira nobre com base floreira e proteção UV50+.',
        price: 3490.00,
        originalPrice: 3890.00,
        discountPercent: 10,
        materials: 'Madeira Nobre e Tecido Poliéster Naval Impermeável',
        dimensions: 'Diâmetro: Ø 3,00m | Altura total: 2,65m | Base Floreira: 60x60x45cm',
        weightKg: 48.0,
        stock: 12,
        images: {
          create: [
            { url: '/images/products/prod-ombrelone-lateral-articulado.jpg', alt: 'Ombrelone Lateral Articulado Durães Móveis Aberto no Deck', displayOrder: 1, isCover: true },
            { url: '/images/products/prod-ombrelone-floreira-detalhe.jpg', alt: 'Ombrelone Fechado com Detalhe da Base Floreira em Madeira', displayOrder: 2, isCover: false },
            { url: '/images/products/prod-ombrelone-lateral-articulado-gallery.jpg', alt: 'Vista Panorâmica do Deck com Ombrelone e Piscina', displayOrder: 3, isCover: false },
            { url: '/images/products/prod-ombrelone-floreira-detalhe-gallery.jpg', alt: 'Mastro e Articulação em Madeira Nobre', displayOrder: 4, isCover: false },
          ]
        },
        variants: {
          create: [
            { name: 'Cinza Chumbo', colorName: 'Cinza Chumbo', colorHex: '#4A4E51', stock: 6, priceAdjustment: 0 },
            { name: 'Bege Areia', colorName: 'Bege Areia', colorHex: '#D2B48C', stock: 4, priceAdjustment: 0 },
            { name: 'Fendi', colorName: 'Fendi', colorHex: '#8C8275', stock: 2, priceAdjustment: 0 },
          ]
        }
      }
    });
  }

  // 2. Atualizar Conjunto Mesa Redonda com Tampo de Vidro
  const mesaVidro = await prisma.product.findFirst({
    where: { OR: [{ slug: 'conjunto-mesa-e-cadeiras-para-jardim' }, { sku: 'CON-MES-006' }] }
  });

  if (mesaVidro) {
    console.log('Atualizando Conjunto Mesa Redonda Vidro e 6 Poltronas...');
    await prisma.productImage.deleteMany({ where: { productId: mesaVidro.id } });
    await prisma.productVariant.deleteMany({ where: { productId: mesaVidro.id } });

    await prisma.product.update({
      where: { id: mesaVidro.id },
      data: {
        name: 'Conjunto de Jantar Externo Mesa Redonda Vidro e 6 Poltronas em Fibra Sintética',
        slug: 'conjunto-jantar-mesa-redonda-vidro-6-poltronas-fibra',
        sku: 'CON-MES-006',
        description: 'Elegância completa para sua varanda gourmet ou deck de piscina. O conjunto é composto por mesa redonda com base trançada em fibra sintética de alta densidade e tampo em vidro temperado bisotado com furo central para ombrelone, acompanhada por 6 poltronas ergonômicas com braços e almofadas de assento em tecido impermeável Acquatec.',
        shortDescription: 'Mesa Ø 1,40m com tampo de vidro temperado e 6 poltronas tramadas em fibra sintética.',
        price: 4890.00,
        originalPrice: 5480.00,
        discountPercent: 11,
        materials: 'Alumínio, Fibra Sintética Virgem Anti-UV e Vidro Temperado 8mm',
        dimensions: 'Mesa: Ø 1,40m x 0,76m (A) | Poltronas: 60cm (L) x 62cm (P) x 85cm (A)',
        weightKg: 62.0,
        stock: 8,
        images: {
          create: [
            { url: '/images/products/prod-conjunto-mesa-vidro-poltronas.jpg', alt: 'Conjunto Mesa Redonda com Tampo de Vidro e 6 Poltronas no Deck da Piscina', displayOrder: 1, isCover: true },
            { url: '/images/products/prod-conjunto-mesa-vidro-poltronas-gallery.jpg', alt: 'Vista Panorâmica do Conjunto de Jantar e Deck Molhado', displayOrder: 2, isCover: false },
          ]
        },
        variants: {
          create: [
            { name: 'Marrom Chocolate', colorName: 'Marrom Chocolate', colorHex: '#3D2817', stock: 4, priceAdjustment: 0 },
            { name: 'Fendi Nobre', colorName: 'Fendi Nobre', colorHex: '#7C7365', stock: 2, priceAdjustment: 0 },
            { name: 'Palha Natural', colorName: 'Palha Natural', colorHex: '#C9B28F', stock: 2, priceAdjustment: 0 },
          ]
        }
      }
    });
  }

  // 3. Novos Produtos Reais
  const newProducts = [
    {
      name: 'Espreguiçadeira Reclinável em Fibra Sintética Marrom Café',
      slug: 'espreguicadeira-reclinavel-fibra-sintetica-marrom',
      sku: 'ESP-REC-002',
      categorySlug: 'espreguicadeiras',
      shortDescription: 'Espreguiçadeira com 4 posições de inclinação e estrutura em alumínio.',
      description: 'Desenvolvida para proporcionar o máximo relaxamento sob o sol. Estrutura tubular em alumínio anticorrosivo revestida artesanalmente com fibra sintética resistente ao cloro, sol e chuva. Encosto com 4 posições de regulagem e curvas ergonômicas que abraçam o corpo.',
      price: 1450.00,
      originalPrice: 1690.00,
      discountPercent: 14,
      materials: 'Alumínio Naval Eletrostático e Fibra Sintética com Proteção UV',
      dimensions: '1,95m (C) x 0,68m (L) x 0,35m (A)',
      weightKg: 9.5,
      stock: 16,
      rating: 4.9,
      reviewsCount: 38,
      featured: true,
      images: [
        { url: '/images/products/prod-espreguicadeira-fibra-marrom.jpg', alt: 'Espreguiçadeira Reclinável Marrom Café no Deck da Piscina', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-espreguicadeira-fibra-marrom-gallery.jpg', alt: 'Vista Detalhada da Trama em Fibra Sintética', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Marrom Café', colorName: 'Marrom Café', colorHex: '#4A3525', stock: 8, priceAdjustment: 0 },
        { name: 'Palha Natural', colorName: 'Palha Natural', colorHex: '#C5A880', stock: 5, priceAdjustment: 0 },
        { name: 'Grafite Fosco', colorName: 'Grafite Fosco', colorHex: '#2E3033', stock: 3, priceAdjustment: 0 },
      ]
    },
    {
      name: 'Espreguiçadeira Anatômica Wave em Fibra Trançada Champagne',
      slug: 'espreguicadeira-anatomica-wave-fibra-champagne',
      sku: 'ESP-WAV-003',
      categorySlug: 'espreguicadeiras',
      shortDescription: 'Design orgânico com pés em curva contínua e trama artesanal vazada.',
      description: 'Design orgânico e arrojado com pés em curvas contínuas estilo Wave. A espreguiçadeira Anatômica Durães Móveis possui trama vazada artesanal que favorece a ventilação e secagem rápida após o banho de piscina, trazendo leveza visual e requinte incomparável ao ambiente.',
      price: 1620.00,
      originalPrice: 1890.00,
      discountPercent: 14,
      materials: 'Alumínio Calandrado Sem Emendas e Fibra Trançada Virgem',
      dimensions: '1,90m (C) x 0,65m (L) x 0,40m (A)',
      weightKg: 8.8,
      stock: 14,
      rating: 5.0,
      reviewsCount: 42,
      featured: true,
      images: [
        { url: '/images/products/prod-espreguicadeira-wave-champagne.jpg', alt: 'Espreguiçadeira Anatômica Wave Champagne à Beira da Piscina', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-espreguicadeira-wave-champagne-gallery.jpg', alt: 'Design de Curvatura Contínua Wave', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Champagne Perolado', colorName: 'Champagne', colorHex: '#D9C8B2', stock: 7, priceAdjustment: 0 },
        { name: 'Areia Nobre', colorName: 'Areia', colorHex: '#E2D5C3', stock: 4, priceAdjustment: 0 },
        { name: 'Café Tostado', colorName: 'Café', colorHex: '#3E2F23', stock: 3, priceAdjustment: 0 },
      ]
    },
    {
      name: 'Conjunto de Espreguiçadeiras com Mesinha de Apoio Grafite',
      slug: 'conjunto-espreguicadeiras-mesinha-apoio-grafite',
      sku: 'ESP-GRA-004',
      categorySlug: 'espreguicadeiras',
      shortDescription: 'Trio de espreguiçadeiras com mesa de apoio em alumínio e fibra preta.',
      description: 'Composição perfeita para piscinas contemporâneas e áreas verdes. Conjunto composto por espreguiçadeiras com estrutura em alumínio com pintura eletrostática na tonalidade grafite fosco e trama densa em fibra sintética preta, acompanhado de mesinha de apoio redonda para drinks e protetor solar.',
      price: 2890.00,
      originalPrice: 3290.00,
      discountPercent: 12,
      materials: 'Alumínio Pintura Poliéster Eletrostática e Fibra Sintética Grafite',
      dimensions: 'Espreguiçadeira: 1,92m (C) x 0,66m (L) x 0,34m (A) | Mesinha: Ø 0,50m x 0,45m (A)',
      weightKg: 24.0,
      stock: 10,
      rating: 4.9,
      reviewsCount: 29,
      featured: true,
      images: [
        { url: '/images/products/prod-espreguicadeira-grafite-trio.jpg', alt: 'Trio de Espreguiçadeiras Grafite com Mesinha de Apoio e Jardim', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-espreguicadeira-grafite-trio-gallery.jpg', alt: 'Vista Panorâmica do Deck e Gramado com Espreguiçadeiras Grafite', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Grafite Fosco', colorName: 'Grafite', colorHex: '#2A2C2E', stock: 6, priceAdjustment: 0 },
        { name: 'Preto Ônix', colorName: 'Preto Ônix', colorHex: '#141414', stock: 4, priceAdjustment: 0 },
      ]
    },
    {
      name: 'Espreguiçadeira em Corda Náutica Terracota e Alumínio Naval',
      slug: 'espreguicadeira-corda-nautica-terracota-aluminio',
      sku: 'ESP-TER-005',
      categorySlug: 'espreguicadeiras',
      shortDescription: 'Corda náutica de alta tenacidade em cor terracota e alumínio naval.',
      description: 'Destaque absoluto de cor e modernidade para seu projeto de lazer. Tramada em corda náutica nobre de alta tenacidade na vibrante cor terracota, com estrutura em alumínio naval com pintura microtexturizada grafite. Conforto térmico incomparável que não esquenta sob o sol intenso.',
      price: 1890.00,
      originalPrice: 2190.00,
      discountPercent: 14,
      materials: 'Corda Náutica com Alma de Polipropileno e Alumínio Naval',
      dimensions: '1,96m (C) x 0,70m (L) x 0,38m (A)',
      weightKg: 10.2,
      stock: 12,
      rating: 5.0,
      reviewsCount: 51,
      featured: true,
      images: [
        { url: '/images/products/prod-espreguicadeira-corda-terracota.jpg', alt: 'Espreguiçadeiras em Corda Náutica Terracota Durães Móveis', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-espreguicadeira-corda-terracota-gallery.jpg', alt: 'Mostruário de Cores em Corda Náutica e Fibra Sintética', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Terracota Vibrante', colorName: 'Terracota', colorHex: '#D95829', stock: 5, priceAdjustment: 0 },
        { name: 'Marrom Chocolate', colorName: 'Marrom Chocolate', colorHex: '#3D2817', stock: 3, priceAdjustment: 0 },
        { name: 'Azul Náutico', colorName: 'Azul Náutico', colorHex: '#1A365D', stock: 2, priceAdjustment: 0 },
        { name: 'Verde Oliva', colorName: 'Verde Oliva', colorHex: '#4A5D3E', stock: 2, priceAdjustment: 0 },
      ]
    },
    {
      name: 'Espreguiçadeira com Braços em Corda Náutica Trama Areia',
      slug: 'espreguicadeira-com-bracos-corda-nautica-areia',
      sku: 'ESP-BRA-006',
      categorySlug: 'espreguicadeiras',
      shortDescription: 'Apoio de braços ergonômico e trama geométrica cruzada em corda náutica areia.',
      description: 'Máximo conforto com apoio para braços integrado e trama geométrica cruzada em corda náutica areia/champagne. Ideal para coberturas, rooftops e bordas de piscina, unindo estética minimalista, ergonomia aperfeiçoada e toque suave e agradável.',
      price: 2050.00,
      originalPrice: 2390.00,
      discountPercent: 14,
      materials: 'Corda Náutica Trama Geométrica e Alumínio Naval Eletrostático',
      dimensions: '1,98m (C) x 0,72m (L) x 0,42m (A)',
      weightKg: 11.0,
      stock: 15,
      rating: 4.9,
      reviewsCount: 34,
      featured: true,
      images: [
        { url: '/images/products/prod-espreguicadeira-nautica-areia.jpg', alt: 'Espreguiçadeira Náutica com Braços em Deck Rooftop', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-espreguicadeira-nautica-areia-gallery.jpg', alt: 'Detalhe da Trama Cruzada Geométrica em Corda Areia', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Areia / Champagne', colorName: 'Areia', colorHex: '#D5C4A1', stock: 7, priceAdjustment: 0 },
        { name: 'Grafite Moderno', colorName: 'Grafite', colorHex: '#35383B', stock: 5, priceAdjustment: 0 },
        { name: 'Off-White Nobre', colorName: 'Off-White', colorHex: '#F0EBE1', stock: 3, priceAdjustment: 0 },
      ]
    },
    {
      name: 'Conjunto Mesa Ripada em Alumínio e 4 Cadeiras em Corda Náutica Preta',
      slug: 'conjunto-mesa-ripada-aluminio-4-cadeiras-corda-preta',
      sku: 'CON-RIP-007',
      categorySlug: 'mesas-e-cadeiras',
      shortDescription: 'Mesa redonda ripada e 4 cadeiras anatômicas tramadas em corda preta.',
      description: 'Design clean e contemporâneo para varandas compactas, decks gourmet e áreas de piscina. Mesa redonda com tampo ripado em alumínio naval e 4 cadeiras anatômicas com espaldar em corda náutica preta tramada verticalmente, resistentes a intempéries e com fácil manutenção.',
      price: 3490.00,
      originalPrice: 3980.00,
      discountPercent: 12,
      materials: 'Alumínio Naval Preto Fosco e Corda Náutica Tratada UV',
      dimensions: 'Mesa: Ø 1,10m x 0,75m (A) | Cadeiras: 56cm (L) x 58cm (P) x 82cm (A)',
      weightKg: 32.0,
      stock: 9,
      rating: 5.0,
      reviewsCount: 27,
      featured: true,
      images: [
        { url: '/images/products/prod-conjunto-mesa-ripada-preta.jpg', alt: 'Conjunto Mesa Ripada e 4 Cadeiras em Corda Náutica Preta no Deck', displayOrder: 1, isCover: true },
        { url: '/images/products/prod-conjunto-mesa-ripada-preta-gallery.jpg', alt: 'Vista Panorâmica da Área de Lazer com Mesa Ripada e Piscina', displayOrder: 2, isCover: false },
      ],
      variants: [
        { name: 'Preto Fosco', colorName: 'Preto Fosco', colorHex: '#1C1C1C', stock: 5, priceAdjustment: 0 },
        { name: 'Cinza Titânio', colorName: 'Cinza Titânio', colorHex: '#4A5056', stock: 4, priceAdjustment: 0 },
      ]
    }
  ];

  for (const item of newProducts) {
    const catId = catMap[item.categorySlug];
    if (!catId) {
      console.warn(`Categoria não encontrada: ${item.categorySlug}`);
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Atualizando produto existente: ${item.name}...`);
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          sku: item.sku,
          shortDescription: item.shortDescription,
          description: item.description,
          price: item.price,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          materials: item.materials,
          dimensions: item.dimensions,
          weightKg: item.weightKg,
          stock: item.stock,
          rating: item.rating,
          reviewsCount: item.reviewsCount,
          featured: item.featured,
          images: { create: item.images },
          variants: { create: item.variants },
        }
      });
    } else {
      console.log(`Criando novo produto: ${item.name}...`);
      await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          categoryId: catId,
          shortDescription: item.shortDescription,
          description: item.description,
          price: item.price,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          materials: item.materials,
          dimensions: item.dimensions,
          weightKg: item.weightKg,
          stock: item.stock,
          rating: item.rating,
          reviewsCount: item.reviewsCount,
          featured: item.featured,
          active: true,
          images: { create: item.images },
          variants: { create: item.variants },
        }
      });
    }
  }

  console.log('✅ Banco de dados atualizado com sucesso com todos os produtos reais!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
