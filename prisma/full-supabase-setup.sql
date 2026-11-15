-- =====================================================================
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
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT,
    "cpf" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "materials" TEXT,
    "dimensions" TEXT,
    "weightKg" DOUBLE PRECISION DEFAULT 25.0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "colorName" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "sku" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "priceAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "guestCpf" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'PIX',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "trackingCode" TEXT,
    "carrierName" TEXT DEFAULT 'Transportadora Especializada',
    "shippingService" TEXT DEFAULT 'Entrega Expressa Especial',
    "couponCode" TEXT,
    "shippingAddress" TEXT NOT NULL,
    "addressId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "productName" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "variantName" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "qrCode" TEXT,
    "qrCodeBase64" TEXT,
    "copyPastePix" TEXT,
    "installments" INTEGER DEFAULT 1,
    "cardLastFour" TEXT,
    "cardBrand" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3),
    "rawResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "userAvatar" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT,
    "comment" TEXT NOT NULL,
    "verifiedPurchase" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "highlightText" TEXT,
    "subtitle" TEXT,
    "buttonText" TEXT NOT NULL DEFAULT 'Ver Coleção Completa',
    "buttonLink" TEXT NOT NULL DEFAULT '/catalogo',
    "imageUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "position" TEXT NOT NULL DEFAULT 'HERO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");

-- CreateIndex
CREATE INDEX "Product_active_idx" ON "Product"("active");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionToken_key" ON "Cart"("sessionToken");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_productId_idx" ON "Favorite"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "Favorite"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreSetting_key_key" ON "StoreSetting"("key");

-- CreateIndex
CREATE INDEX "StoreSetting_key_idx" ON "StoreSetting"("key");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;



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
-- Inserindo 9 registros em "StoreSetting"
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000011xuvx17acz9', 'STORE_NAME', 'Durães Móveis', 'Nome da loja', '2026-11-09T23:20:03.685Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000111xut1c2fijj', 'STORE_TAGLINE', 'Móveis Externos Premium', 'Slogan da loja', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000211xusd1l3pf8', 'STORE_PHONE', '(19) 4000-1234', 'Telefone comercial', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000311xudq9ajdz2', 'STORE_WHATSAPP', '551940001234', 'WhatsApp oficial', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000411xu831wnsm3', 'STORE_EMAIL', 'contato@duraesmoveis.com.br', 'E-mail de atendimento', '2026-11-09T23:20:03.685Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000511xuepfoxns6', 'STORE_ADDRESS', 'Av. Norte-Sul, 1234 - Taquaral, Campinas - SP', 'Endereço físico', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000611xu66vk0awb', 'FREE_SHIPPING_THRESHOLD', '2999', 'Valor mínimo para frete grátis', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000711xuka1ue2vi', 'PIX_DISCOUNT_PERCENT', '5', 'Desconto à vista no Pix (%)', '2026-11-09T22:41:59.796Z');
INSERT INTO "StoreSetting" ("id", "key", "value", "description", "updatedAt") VALUES ('cmw9uj3ec000811xuii30a02i', 'MAX_INSTALLMENTS', '12', 'Número máximo de parcelas sem juros', '2026-11-09T22:41:59.796Z');

-- Inserindo 2 registros em "Banner"
INSERT INTO "Banner" ("id", "title", "highlightText", "subtitle", "buttonText", "buttonLink", "imageUrl", "active", "displayOrder", "position", "createdAt", "updatedAt") VALUES ('cmw9uj3q5002311xuo3dv4xwd', 'Transforme seu espaço externo', 'em um ambiente incrível!', 'Móveis externos com design moderno, qualidade premium e conforto incomparável.', 'Ver Coleção Completa', '/catalogo', '/images/hero-outdoor-luxury.jpg', TRUE, 1, 'HERO', '2026-11-09T22:42:00.222Z', '2026-11-09T22:42:00.222Z');
INSERT INTO "Banner" ("id", "title", "highlightText", "subtitle", "buttonText", "buttonLink", "imageUrl", "active", "displayOrder", "position", "createdAt", "updatedAt") VALUES ('cmw9uj3q5002411xurf8v5ua8', 'Linha Riviera & Resort 2026', 'Durabilidade que Impressiona', 'Estruturas em alumínio naval e cordas náuticas com 5 anos de garantia de fábrica.', 'Conhecer Linha Náutica', '/categoria/sofas-externos', '/images/banner-oferta-especial.jpg', TRUE, 2, 'HERO', '2026-11-09T22:42:00.222Z', '2026-11-09T22:42:00.222Z');

-- Inserindo 3 registros em "Coupon"
INSERT INTO "Coupon" ("id", "code", "description", "discountType", "discountValue", "minOrderValue", "maxUses", "currentUses", "validFrom", "validUntil", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3qh002511xubybrtr2c', 'BEMVINDO10', '10% de desconto na primeira compra', 'PERCENTAGE', 10, 500, 1000, 0, NULL, NULL, TRUE, '2026-11-09T22:42:00.234Z', '2026-11-09T22:42:00.234Z');
INSERT INTO "Coupon" ("id", "code", "description", "discountType", "discountValue", "minOrderValue", "maxUses", "currentUses", "validFrom", "validUntil", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3qh002611xuzvyt5rgy', 'OUTDOOR15', '15% de desconto especial em móveis externos', 'PERCENTAGE', 15, 2000, 500, 0, NULL, NULL, TRUE, '2026-11-09T22:42:00.234Z', '2026-11-09T22:42:00.234Z');
INSERT INTO "Coupon" ("id", "code", "description", "discountType", "discountValue", "minOrderValue", "maxUses", "currentUses", "validFrom", "validUntil", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3qh002711xu3l1uj6yb', 'VERAO500', 'R$ 500 OFF em compras acima de R$ 5.000', 'FIXED', 500, 5000, 200, 0, NULL, NULL, TRUE, '2026-11-09T22:42:00.234Z', '2026-11-09T22:42:00.234Z');

-- Inserindo 2 registros em "User"
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "phone", "cpf", "avatarUrl", "createdAt", "updatedAt") VALUES ('cmw9uj3gh000911xup9ujdp8w', 'Administrador OutdoorStyle', 'admin@outdoorstyle.com.br', '$2a$10$8FzlDml3X/UTrJSDD1vOR.n4OBs09uCW5iDhGJl7ddyGBEPgUX5Om', 'ADMIN', '(19) 99000-1111', '000.000.000-00', NULL, '2026-11-09T22:41:59.873Z', '2026-11-09T22:41:59.873Z');
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "phone", "cpf", "avatarUrl", "createdAt", "updatedAt") VALUES ('cmw9uj3ik000a11xugitf0uaa', 'Edson Silva', 'edson@outdoorstyle.com.br', '$2a$10$t7lGbQ1faF1Ved0Xez.YjuTYY0ftdz/S9dWY5zqyW/GLxKPI7BW9C', 'CUSTOMER', '(19) 99876-5432', '123.456.789-00', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', '2026-11-09T22:41:59.948Z', '2026-11-09T22:41:59.948Z');

-- Inserindo 1 registros em "Address"
INSERT INTO "Address" ("id", "userId", "street", "number", "complement", "neighborhood", "city", "state", "zipCode", "isDefault", "createdAt", "updatedAt") VALUES ('cmw9uj3ix000c11xuuoqs8yuh', 'cmw9uj3ik000a11xugitf0uaa', 'Av. Barão de Itapura', '1234', 'Apto 42', 'Guanabara', 'Campinas', 'SP', '13020-432', TRUE, '2026-11-09T22:41:59.962Z', '2026-11-09T22:41:59.962Z');

-- Inserindo 6 registros em "Category"
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3ja000d11xusc96agp0', 'Mesas e Cadeiras', 'mesas-e-cadeiras', 'Conjuntos de jantar e mesas para áreas externas com tampos em madeira teca e vidro temperado.', '/images/cat-mesas-cadeiras.jpg', 2, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3jd000f11xu782pqwd0', 'Acessórios', 'acessorios', 'Lareiras de jardim, capas protetoras, luminárias solares e almofadas decorativas impermeáveis.', '/images/cat-acessorios.jpg', 6, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3jc000e11xui1whx6dq', 'Poltronas', 'poltronas', 'Poltronas para jardim, varanda e piscinas com estrutura em alumínio e corda náutica.', '/images/cat-poltronas.jpg', 1, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3jd000g11xuac420fhl', 'Guarda-Sóis', 'guarda-sois', 'Guarda-sóis laterais e centrais com estrutura em alumínio giratório 360° e proteção solar UV 50+.', '/images/cat-guarda-sois.jpg', 5, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3je000h11xug4xw56qu', 'Sofás Externos', 'sofas-externos', 'Sofás modulares e de 2 a 4 lugares com estofados impermeáveis e acabamento de alto padrão.', '/images/cat-sofas-externos.jpg', 4, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "displayOrder", "active", "createdAt", "updatedAt") VALUES ('cmw9uj3je000i11xu1q7r69e5', 'Espreguiçadeiras', 'espreguicadeiras', 'Espreguiçadeiras reclináveis para borda de piscina e decks, com tecido sling e almofadas náuticas.', '/images/cat-espreguicadeiras.jpg', 3, TRUE, '2026-11-09T22:41:59.974Z', '2026-11-09T22:41:59.974Z');

-- Inserindo 15 registros em "Product"
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3n0000k11xuoa7jzruk', 'Sofá Externo Riviera 3 Lugares', 'sofa-externo-riviera-3-lugares', 'SOF-RIV-003', 'O Sofá Externo Riviera 3 Lugares une arquitetura contemporânea e máxima durabilidade para áreas de lazer sofisticadas. Fabricado com estrutura 100% em alumínio de parede espessa com pintura eletrostática a pó, possui trama artesanal em corda náutica com tratamento UV e estofamento em espuma D-33 revestida em tecido impermeável Sunbrella, resistente à água, cloro e sol forte.', 'Sofá externo com estrutura em alumínio nobre, fibra sintética e almofadas impermeáveis. Ideal para varandas, jardim e áreas de piscina.', 5391, 5990, 10, 14, TRUE, TRUE, TRUE, 4.9, 92, 'Alumínio estrutural eletrostático, Corda náutica UV, Tecido Sunbrella impermeável', '220 cm (L) x 85 cm (P) x 68 cm (A)', 34.5, 'cmw9uj3je000h11xug4xw56qu', '2026-11-09T22:42:00.108Z', '2026-11-15T07:03:47.342Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3nd000u11xushi7hx5i', 'Sofá Modular Cayenne 4 Lugares', 'sofa-modular-cayenne-4-lugares', 'SOF-CAY-004', 'Módulos versáteis que se adaptam perfeitamente a varandas gourmet e decks ao redor da piscina. Estrutura robusta em madeira teca certificada combinada com pés em alumínio anodizado fosco.', 'Design modular sofisticado, perfeito para receber amigos e família em áreas abertas.', 7898, 8975, 12, 8, TRUE, TRUE, TRUE, 5, 18, 'Madeira Teca FSC, Alumínio preto fosco, Tecido náutico repelente', '290 cm (L) x 90 cm (P) x 70 cm (A)', 52, 'cmw9uj3je000h11xug4xw56qu', '2026-11-09T22:42:00.121Z', '2026-11-09T22:42:00.121Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3no001011xu7if1boy1', 'Sofá Firenze 2 Lugares', 'sofa-firenze-2-lugares', 'SOF-FIR-002', 'Ideal para sacadas e espaços compactos que não abrem mão do luxo e do conforto ergonômico.', 'Proporções equilibradas e acabamento impecável em fibra sintética de alta densidade.', 4303.2, 4790, 10, 12, TRUE, TRUE, FALSE, 4.8, 37, 'Fibra sintética virgem anti-ressecamento, Alumínio, Espuma D-30', '160 cm (L) x 80 cm (P) x 72 cm (A)', 22, 'cmw9uj3je000h11xug4xw56qu', '2026-11-09T22:42:00.132Z', '2026-11-09T22:42:00.132Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3o1001511xuugkau2dt', 'Sofá Outdoor Maré 3 Lugares', 'sofa-outdoor-mare-3-lugares', 'SOF-MAR-003', 'Linhas orgânicas inspiradas no movimento das ondas. Proporciona relaxamento sem precedentes.', 'Linhas suaves e design moderno que valorizam qualquer área externa.', 6090, 6790, 10, 7, TRUE, TRUE, FALSE, 4.9, 14, 'Corda náutica tricotada, Alumínio naval, Tecido poliéster naval', '210 cm (L) x 85 cm (P) x 75 cm (A)', 31, 'cmw9uj3je000h11xug4xw56qu', '2026-11-09T22:42:00.145Z', '2026-11-09T22:42:00.145Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3od001a11xug7h1yavg', 'Poltrona de Fibra Sintética Premium', 'poltrona-de-fibra-sintetica-premium', 'POL-FIB-001', 'Aconchegante e envolvente, a Poltrona Premium possui almofada lombar e assento extra macio.', 'Poltrona individual ergonômica com fibra sintética trançada artesanalmente.', 1199, 1499, 20, 20, TRUE, TRUE, FALSE, 4.9, 154, 'Fibra sintética marrom acobreado, Alumínio estrutural', '82 cm (L) x 80 cm (P) x 78 cm (A)', 11.5, 'cmw9uj3jc000e11xui1whx6dq', '2026-11-09T22:42:00.157Z', '2026-11-09T22:42:00.157Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3op001g11xum43ll04l', 'Conjunto de Jantar Externo Mesa Redonda Vidro e 6 Poltronas em Fibra Sintética', 'conjunto-jantar-mesa-redonda-vidro-6-poltronas-fibra', 'CON-MES-006', 'Elegância completa para sua varanda gourmet ou deck de piscina. O conjunto é composto por mesa redonda com base trançada em fibra sintética de alta densidade e tampo em vidro temperado bisotado com furo central para ombrelone, acompanhada por 6 poltronas ergonômicas com braços e almofadas de assento em tecido impermeável Acquatec.', 'Mesa Ø 1,40m com tampo de vidro temperado e 6 poltronas tramadas em fibra sintética.', 4890, 5480, 11, 8, TRUE, TRUE, FALSE, 5, 142, 'Alumínio, Fibra Sintética Virgem Anti-UV e Vidro Temperado 8mm', 'Mesa: Ø 1,40m x 0,76m (A) | Poltronas: 60cm (L) x 62cm (P) x 85cm (A)', 62, 'cmw9uj3ja000d11xusc96agp0', '2026-11-09T22:42:00.170Z', '2026-11-10T00:41:11.604Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3p3001m11xuujqs30hb', 'Espreguiçadeira Alumínio com Tela Sling', 'espreguicadeira-aluminio-com-tela-sling', 'ESP-SLI-001', 'Prática, leve e ultrarresistente. Possui 5 posições de reclinação e rodízios embutidos para fácil locomoção.', 'Espreguiçadeira com regulagem de 5 posições e secagem ultrarrápida.', 1490, 1990, 25, 16, TRUE, TRUE, FALSE, 4.8, 135, 'Alumínio eletrostático, Tela sling respirável antibacteriana', '195 cm (C) x 65 cm (L) x 35 cm (A)', 8.5, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-09T22:42:00.183Z', '2026-11-09T22:42:00.183Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3pf001s11xuv2pw6c0m', 'Sofá Externo 3 Lugares com Almofadas', 'sofa-externo-3-lugares-com-almofadas', 'SOF-ALM-003', 'Sofá de 3 lugares com design contemporâneo, almofadas densas e repelentes à água, ideal para momentos de relaxamento em varandas e jardins.', 'Sofá externo com almofadas impermeáveis e estrutura em alumínio eletrostático fosco.', 2659, 3249, 18, 12, TRUE, TRUE, FALSE, 4.9, 128, 'Alumínio naval, Tecido poliéster impermeável, Espuma D-33', '215 cm (L) x 85 cm (P) x 70 cm (A)', 30, 'cmw9uj3je000h11xug4xw56qu', '2026-11-09T22:42:00.195Z', '2026-11-09T22:42:00.195Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9uj3ps001y11xuk0fc7fn6', 'Ombrelone Lateral Articulado com Base Floreira em Madeira Nobre', 'ombrelone-lateral-articulado-base-floreira-madeira', 'OMB-LAT-003', 'O Ombrelone Lateral Articulado Durães Móveis é o ápice da sofisticação e funcionalidade para áreas externas de alto padrão. Com estrutura robusta em madeira nobre tratada contra intempéries e acabamento naval, possui sistema de articulação suave e cobertura em tecido hidrorrepelente com proteção UV50+. Sua base exclusiva com floreira em madeira maciça garante estabilidade máxima contra ventos sem abrir mão da estética natural.', 'Ombrelone articulado 3m em madeira nobre com base floreira e proteção UV50+.', 3490, 3890, 10, 12, TRUE, TRUE, FALSE, 4.8, 110, 'Madeira Nobre e Tecido Poliéster Naval Impermeável', 'Diâmetro: Ø 3,00m | Altura total: 2,65m | Base Floreira: 60x60x45cm', 48, 'cmw9uj3jd000g11xuac420fhl', '2026-11-09T22:42:00.209Z', '2026-11-10T00:41:11.569Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysds2000dqvekhhehc8hq', 'Espreguiçadeira Reclinável em Fibra Sintética Marrom Café', 'espreguicadeira-reclinavel-fibra-sintetica-marrom', 'ESP-REC-002', 'Desenvolvida para proporcionar o máximo relaxamento sob o sol. Estrutura tubular em alumínio anticorrosivo revestida artesanalmente com fibra sintética resistente ao cloro, sol e chuva. Encosto com 4 posições de regulagem e curvas ergonômicas que abraçam o corpo.', 'Espreguiçadeira com 4 posições de inclinação e estrutura em alumínio.', 1450, 1690, 14, 16, TRUE, TRUE, FALSE, 4.9, 38, 'Alumínio Naval Eletrostático e Fibra Sintética com Proteção UV', '1,95m (C) x 0,68m (L) x 0,35m (A)', 9.5, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-10T00:41:11.618Z', '2026-11-10T00:41:11.618Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysdsf000kqvek1uz9wway', 'Espreguiçadeira Anatômica Wave em Fibra Trançada Champagne', 'espreguicadeira-anatomica-wave-fibra-champagne', 'ESP-WAV-003', 'Design orgânico e arrojado com pés em curvas contínuas estilo Wave. A espreguiçadeira Anatômica Durães Móveis possui trama vazada artesanal que favorece a ventilação e secagem rápida após o banho de piscina, trazendo leveza visual e requinte incomparável ao ambiente.', 'Design orgânico com pés em curva contínua e trama artesanal vazada.', 1620, 1890, 14, 14, TRUE, TRUE, FALSE, 5, 42, 'Alumínio Calandrado Sem Emendas e Fibra Trançada Virgem', '1,90m (C) x 0,65m (L) x 0,40m (A)', 8.8, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-10T00:41:11.632Z', '2026-11-10T00:41:11.632Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysdst000rqvek4j5801yk', 'Conjunto de Espreguiçadeiras com Mesinha de Apoio Grafite', 'conjunto-espreguicadeiras-mesinha-apoio-grafite', 'ESP-GRA-004', 'Composição perfeita para piscinas contemporâneas e áreas verdes. Conjunto composto por espreguiçadeiras com estrutura em alumínio com pintura eletrostática na tonalidade grafite fosco e trama densa em fibra sintética preta, acompanhado de mesinha de apoio redonda para drinks e protetor solar.', 'Trio de espreguiçadeiras com mesa de apoio em alumínio e fibra preta.', 2890, 3290, 12, 10, TRUE, TRUE, FALSE, 4.9, 29, 'Alumínio Pintura Poliéster Eletrostática e Fibra Sintética Grafite', 'Espreguiçadeira: 1,92m (C) x 0,66m (L) x 0,34m (A) | Mesinha: Ø 0,50m x 0,45m (A)', 24, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-10T00:41:11.645Z', '2026-11-10T00:41:11.645Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysdtm000xqvekjxw3k35e', 'Espreguiçadeira em Corda Náutica Terracota e Alumínio Naval', 'espreguicadeira-corda-nautica-terracota-aluminio', 'ESP-TER-005', 'Destaque absoluto de cor e modernidade para seu projeto de lazer. Tramada em corda náutica nobre de alta tenacidade na vibrante cor terracota, com estrutura em alumínio naval com pintura microtexturizada grafite. Conforto térmico incomparável que não esquenta sob o sol intenso.', 'Corda náutica de alta tenacidade em cor terracota e alumínio naval.', 1890, 2190, 14, 12, TRUE, TRUE, FALSE, 5, 51, 'Corda Náutica com Alma de Polipropileno e Alumínio Naval', '1,96m (C) x 0,70m (L) x 0,38m (A)', 10.2, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-10T00:41:11.674Z', '2026-11-10T00:41:11.674Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysdty0015qvek71z8w1ss', 'Espreguiçadeira com Braços em Corda Náutica Trama Areia', 'espreguicadeira-com-bracos-corda-nautica-areia', 'ESP-BRA-006', 'Máximo conforto com apoio para braços integrado e trama geométrica cruzada em corda náutica areia/champagne. Ideal para coberturas, rooftops e bordas de piscina, unindo estética minimalista, ergonomia aperfeiçoada e toque suave e agradável.', 'Apoio de braços ergonômico e trama geométrica cruzada em corda náutica areia.', 2050, 2390, 14, 15, TRUE, TRUE, FALSE, 4.9, 34, 'Corda Náutica Trama Geométrica e Alumínio Naval Eletrostático', '1,98m (C) x 0,72m (L) x 0,42m (A)', 11, 'cmw9uj3je000i11xu1q7r69e5', '2026-11-10T00:41:11.687Z', '2026-11-10T00:41:11.687Z');
INSERT INTO "Product" ("id", "name", "slug", "sku", "description", "shortDescription", "price", "originalPrice", "discountPercent", "stock", "active", "featured", "isNew", "rating", "reviewsCount", "materials", "dimensions", "weightKg", "categoryId", "createdAt", "updatedAt") VALUES ('cmw9ysduc001cqvek5nvmr1dm', 'Conjunto Mesa Ripada em Alumínio e 4 Cadeiras em Corda Náutica Preta', 'conjunto-mesa-ripada-aluminio-4-cadeiras-corda-preta', 'CON-RIP-007', 'Design clean e contemporâneo para varandas compactas, decks gourmet e áreas de piscina. Mesa redonda com tampo ripado em alumínio naval e 4 cadeiras anatômicas com espaldar em corda náutica preta tramada verticalmente, resistentes a intempéries e com fácil manutenção.', 'Mesa redonda ripada e 4 cadeiras anatômicas tramadas em corda preta.', 3490, 3980, 12, 9, TRUE, TRUE, FALSE, 5, 27, 'Alumínio Naval Preto Fosco e Corda Náutica Tratada UV', 'Mesa: Ø 1,10m x 0,75m (A) | Cadeiras: 56cm (L) x 58cm (P) x 82cm (A)', 32, 'cmw9uj3ja000d11xusc96agp0', '2026-11-10T00:41:11.700Z', '2026-11-10T00:41:11.700Z');

-- Inserindo 32 registros em "ProductImage"
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3n0000l11xugze99ejt', 'cmw9uj3n0000k11xuoa7jzruk', '/images/prod-sofa-riviera.jpg', 'Sofá Externo Riviera 3 Lugares - Vista Principal Jardim', 1, TRUE, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3n0000m11xumlroz384', 'cmw9uj3n0000k11xuoa7jzruk', '/images/hero-outdoor-luxury.jpg', 'Sofá Externo Riviera 3 Lugares - Vista Noturna Deck Iluminado', 2, FALSE, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3n0000n11xueksgx19y', 'cmw9uj3n0000k11xuoa7jzruk', '/images/cat-sofas-externos.jpg', 'Sofá Externo Riviera 3 Lugares - Detalhe da Trama Náutica', 3, FALSE, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3n0000o11xu46peonzc', 'cmw9uj3n0000k11xuoa7jzruk', '/images/prod-sofa-3-lugares.jpg', 'Sofá Externo Riviera 3 Lugares - Almofadas Impermeáveis', 4, FALSE, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3nd000v11xutity4osy', 'cmw9uj3nd000u11xushi7hx5i', '/images/prod-sofa-cayenne.jpg', 'Sofá Modular Cayenne 4 Lugares', 1, TRUE, '2026-11-09T22:42:00.121Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3nd000w11xuxpz2fzwt', 'cmw9uj3nd000u11xushi7hx5i', '/images/hero-outdoor-luxury.jpg', 'Sofá Modular Cayenne Ambiente Externo', 2, FALSE, '2026-11-09T22:42:00.121Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3no001111xuqm07go7v', 'cmw9uj3no001011xu7if1boy1', '/images/prod-sofa-firenze.jpg', 'Sofá Firenze 2 Lugares', 1, TRUE, '2026-11-09T22:42:00.132Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3o1001611xupo5depeh', 'cmw9uj3o1001511xuugkau2dt', '/images/prod-sofa-mare.jpg', 'Sofá Outdoor Maré 3 Lugares', 1, TRUE, '2026-11-09T22:42:00.145Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3od001b11xu8jt5zru3', 'cmw9uj3od001a11xug7h1yavg', '/images/prod-poltrona-fibra.jpg', 'Poltrona de Fibra Sintética Premium', 1, TRUE, '2026-11-09T22:42:00.157Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3od001c11xur511v1r1', 'cmw9uj3od001a11xug7h1yavg', '/images/cat-poltronas.jpg', 'Poltrona de Fibra Sintética - Detalhe', 2, FALSE, '2026-11-09T22:42:00.157Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3p3001n11xu0gidrrcu', 'cmw9uj3p3001m11xuujqs30hb', '/images/prod-espreguicadeira-sling.jpg', 'Espreguiçadeira Alumínio com Tela Sling', 1, TRUE, '2026-11-09T22:42:00.183Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3p3001o11xu0s5zeers', 'cmw9uj3p3001m11xuujqs30hb', '/images/cat-espreguicadeiras.jpg', 'Espreguiçadeira Alumínio Piscina', 2, FALSE, '2026-11-09T22:42:00.183Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3pf001t11xuzuhn18tk', 'cmw9uj3pf001s11xuv2pw6c0m', '/images/prod-sofa-3-lugares.jpg', 'Sofá Externo 3 Lugares com Almofadas', 1, TRUE, '2026-11-09T22:42:00.195Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9uj3pf001u11xunqtfl05c', 'cmw9uj3pf001s11xuv2pw6c0m', '/images/cat-sofas-externos.jpg', 'Sofá Externo 3 Lugares Varanda', 2, FALSE, '2026-11-09T22:42:00.195Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdqp0000qvek2kzh5ga4', 'cmw9uj3ps001y11xuk0fc7fn6', '/images/products/prod-ombrelone-lateral-articulado.jpg', 'Ombrelone Lateral Articulado Durães Móveis Aberto no Deck', 1, TRUE, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdqp0001qveks82g8yd8', 'cmw9uj3ps001y11xuk0fc7fn6', '/images/products/prod-ombrelone-floreira-detalhe.jpg', 'Ombrelone Fechado com Detalhe da Base Floreira em Madeira', 2, FALSE, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdqp0002qveke8vygwam', 'cmw9uj3ps001y11xuk0fc7fn6', '/images/products/prod-ombrelone-lateral-articulado-gallery.jpg', 'Vista Panorâmica do Deck com Ombrelone e Piscina', 3, FALSE, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdqp0003qvektk52hzgf', 'cmw9uj3ps001y11xuk0fc7fn6', '/images/products/prod-ombrelone-floreira-detalhe-gallery.jpg', 'Mastro e Articulação em Madeira Nobre', 4, FALSE, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdro0007qvekgs4w5izh', 'cmw9uj3op001g11xum43ll04l', '/images/products/prod-conjunto-mesa-vidro-poltronas.jpg', 'Conjunto Mesa Redonda com Tampo de Vidro e 6 Poltronas no Deck da Piscina', 1, TRUE, '2026-11-10T00:41:11.604Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdro0008qvekhfngf1tf', 'cmw9uj3op001g11xum43ll04l', '/images/products/prod-conjunto-mesa-vidro-poltronas-gallery.jpg', 'Vista Panorâmica do Conjunto de Jantar e Deck Molhado', 2, FALSE, '2026-11-10T00:41:11.604Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysds2000eqvekj6rsbvj6', 'cmw9ysds2000dqvekhhehc8hq', '/images/products/prod-espreguicadeira-fibra-marrom.jpg', 'Espreguiçadeira Reclinável Marrom Café no Deck da Piscina', 1, TRUE, '2026-11-10T00:41:11.618Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysds2000fqvekyzmrd639', 'cmw9ysds2000dqvekhhehc8hq', '/images/products/prod-espreguicadeira-fibra-marrom-gallery.jpg', 'Vista Detalhada da Trama em Fibra Sintética', 2, FALSE, '2026-11-10T00:41:11.618Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdsf000lqvek9n0gu1qe', 'cmw9ysdsf000kqvek1uz9wway', '/images/products/prod-espreguicadeira-wave-champagne.jpg', 'Espreguiçadeira Anatômica Wave Champagne à Beira da Piscina', 1, TRUE, '2026-11-10T00:41:11.632Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdsf000mqveklnpafj22', 'cmw9ysdsf000kqvek1uz9wway', '/images/products/prod-espreguicadeira-wave-champagne-gallery.jpg', 'Design de Curvatura Contínua Wave', 2, FALSE, '2026-11-10T00:41:11.632Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdst000sqvek9p1nmzid', 'cmw9ysdst000rqvek4j5801yk', '/images/products/prod-espreguicadeira-grafite-trio.jpg', 'Trio de Espreguiçadeiras Grafite com Mesinha de Apoio e Jardim', 1, TRUE, '2026-11-10T00:41:11.645Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdst000tqvekbdhihta8', 'cmw9ysdst000rqvek4j5801yk', '/images/products/prod-espreguicadeira-grafite-trio-gallery.jpg', 'Vista Panorâmica do Deck e Gramado com Espreguiçadeiras Grafite', 2, FALSE, '2026-11-10T00:41:11.645Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdtm000yqvekucq4sb8h', 'cmw9ysdtm000xqvekjxw3k35e', '/images/products/prod-espreguicadeira-corda-terracota.jpg', 'Espreguiçadeiras em Corda Náutica Terracota Durães Móveis', 1, TRUE, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdtm000zqvek0jn7cyal', 'cmw9ysdtm000xqvekjxw3k35e', '/images/products/prod-espreguicadeira-corda-terracota-gallery.jpg', 'Mostruário de Cores em Corda Náutica e Fibra Sintética', 2, FALSE, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdty0016qvek2hcra9tf', 'cmw9ysdty0015qvek71z8w1ss', '/images/products/prod-espreguicadeira-nautica-areia.jpg', 'Espreguiçadeira Náutica com Braços em Deck Rooftop', 1, TRUE, '2026-11-10T00:41:11.687Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysdty0017qvekcjte1yfy', 'cmw9ysdty0015qvek71z8w1ss', '/images/products/prod-espreguicadeira-nautica-areia-gallery.jpg', 'Detalhe da Trama Cruzada Geométrica em Corda Areia', 2, FALSE, '2026-11-10T00:41:11.687Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysduc001dqvek7z5dzvur', 'cmw9ysduc001cqvek5nvmr1dm', '/images/products/prod-conjunto-mesa-ripada-preta.jpg', 'Conjunto Mesa Ripada e 4 Cadeiras em Corda Náutica Preta no Deck', 1, TRUE, '2026-11-10T00:41:11.700Z');
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "displayOrder", "isCover", "createdAt") VALUES ('cmw9ysduc001eqvekh3yro4np', 'cmw9ysduc001cqvek5nvmr1dm', '/images/products/prod-conjunto-mesa-ripada-preta-gallery.jpg', 'Vista Panorâmica da Área de Lazer com Mesa Ripada e Piscina', 2, FALSE, '2026-11-10T00:41:11.700Z');

-- Inserindo 39 registros em "ProductVariant"
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3n0000p11xue6d677v5', 'cmw9uj3n0000k11xuoa7jzruk', 'Taupe', 'Taupe', '#8C7A6B', 'SOF-RIV-003-TAU', 6, 0, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3n0000q11xuqfiuk3es', 'cmw9uj3n0000k11xuoa7jzruk', 'Grafite', 'Grafite', '#2B2B2B', 'SOF-RIV-003-GRA', 4, 0, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3n0000r11xu3zys2abl', 'cmw9uj3n0000k11xuoa7jzruk', 'Bege Areia', 'Bege Areia', '#D1C7BD', 'SOF-RIV-003-BEG', 3, 0, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3n0000s11xup5x8mr3b', 'cmw9uj3n0000k11xuoa7jzruk', 'Marrom Canela', 'Marrom Canela', '#5B3A29', 'SOF-RIV-003-MAR', 1, 0, '2026-11-09T22:42:00.108Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3nd000x11xuyqlya53y', 'cmw9uj3nd000u11xushi7hx5i', 'Grafite', 'Grafite', '#2B2B2B', 'SOF-CAY-004-GRA', 5, 0, '2026-11-09T22:42:00.121Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3nd000y11xumzo11exg', 'cmw9uj3nd000u11xushi7hx5i', 'Off-White', 'Off-White', '#F0ECE1', 'SOF-CAY-004-OFF', 3, 0, '2026-11-09T22:42:00.121Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3no001211xupvngzl38', 'cmw9uj3no001011xu7if1boy1', 'Taupe', 'Taupe', '#8C7A6B', 'SOF-FIR-002-TAU', 8, 0, '2026-11-09T22:42:00.132Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3no001311xudt2g2do6', 'cmw9uj3no001011xu7if1boy1', 'Bege', 'Bege', '#D1C7BD', 'SOF-FIR-002-BEG', 4, 0, '2026-11-09T22:42:00.132Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3o1001711xu181m572g', 'cmw9uj3o1001511xuugkau2dt', 'Grafite', 'Grafite', '#2B2B2B', 'SOF-MAR-003-GRA', 4, 0, '2026-11-09T22:42:00.145Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3o1001811xusc2me8y1', 'cmw9uj3o1001511xuugkau2dt', 'Cinza Névoa', 'Cinza Névoa', '#9E9E9E', 'SOF-MAR-003-CIN', 3, 0, '2026-11-09T22:42:00.145Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3od001d11xuhu51i307', 'cmw9uj3od001a11xug7h1yavg', 'Café', 'Café', '#3D2817', 'POL-FIB-001-CAF', 12, 0, '2026-11-09T22:42:00.157Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3od001e11xu4k4v60uv', 'cmw9uj3od001a11xug7h1yavg', 'Palha', 'Palha', '#C5A880', 'POL-FIB-001-PAL', 8, 0, '2026-11-09T22:42:00.157Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3p3001p11xul15z83pl', 'cmw9uj3p3001m11xuujqs30hb', 'Grafite', 'Grafite', '#2B2B2B', 'ESP-SLI-001-GRA', 10, 0, '2026-11-09T22:42:00.183Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3p3001q11xu2vyqsee4', 'cmw9uj3p3001m11xuujqs30hb', 'Azul Marinho', 'Azul Marinho', '#1B2A4A', 'ESP-SLI-001-AZU', 6, 0, '2026-11-09T22:42:00.183Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3pf001v11xuhhm59j9e', 'cmw9uj3pf001s11xuv2pw6c0m', 'Taupe', 'Taupe', '#8C7A6B', 'SOF-ALM-003-TAU', 7, 0, '2026-11-09T22:42:00.195Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9uj3pf001w11xuga126c4z', 'cmw9uj3pf001s11xuv2pw6c0m', 'Grafite', 'Grafite', '#2B2B2B', 'SOF-ALM-003-GRA', 5, 0, '2026-11-09T22:42:00.195Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdqp0004qvekile95urn', 'cmw9uj3ps001y11xuk0fc7fn6', 'Cinza Chumbo', 'Cinza Chumbo', '#4A4E51', NULL, 6, 0, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdqp0005qvek913ckwpr', 'cmw9uj3ps001y11xuk0fc7fn6', 'Bege Areia', 'Bege Areia', '#D2B48C', NULL, 4, 0, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdqp0006qvekz1lwjm4w', 'cmw9uj3ps001y11xuk0fc7fn6', 'Fendi', 'Fendi', '#8C8275', NULL, 2, 0, '2026-11-10T00:41:11.569Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdro0009qvekee9bjz3w', 'cmw9uj3op001g11xum43ll04l', 'Marrom Chocolate', 'Marrom Chocolate', '#3D2817', NULL, 4, 0, '2026-11-10T00:41:11.604Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdro000aqvekgg5u72pr', 'cmw9uj3op001g11xum43ll04l', 'Fendi Nobre', 'Fendi Nobre', '#7C7365', NULL, 2, 0, '2026-11-10T00:41:11.604Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdro000bqvekab4yul81', 'cmw9uj3op001g11xum43ll04l', 'Palha Natural', 'Palha Natural', '#C9B28F', NULL, 2, 0, '2026-11-10T00:41:11.604Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysds2000gqvekc72i29bo', 'cmw9ysds2000dqvekhhehc8hq', 'Marrom Café', 'Marrom Café', '#4A3525', NULL, 8, 0, '2026-11-10T00:41:11.618Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysds2000hqvekobcz13mn', 'cmw9ysds2000dqvekhhehc8hq', 'Palha Natural', 'Palha Natural', '#C5A880', NULL, 5, 0, '2026-11-10T00:41:11.618Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysds2000iqvek3pyox6f7', 'cmw9ysds2000dqvekhhehc8hq', 'Grafite Fosco', 'Grafite Fosco', '#2E3033', NULL, 3, 0, '2026-11-10T00:41:11.618Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdsf000nqvekou52znh0', 'cmw9ysdsf000kqvek1uz9wway', 'Champagne Perolado', 'Champagne', '#D9C8B2', NULL, 7, 0, '2026-11-10T00:41:11.632Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdsf000oqvek6l2ridwl', 'cmw9ysdsf000kqvek1uz9wway', 'Areia Nobre', 'Areia', '#E2D5C3', NULL, 4, 0, '2026-11-10T00:41:11.632Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdsf000pqvek2g3eicb5', 'cmw9ysdsf000kqvek1uz9wway', 'Café Tostado', 'Café', '#3E2F23', NULL, 3, 0, '2026-11-10T00:41:11.632Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdst000uqvekb5p6ylxf', 'cmw9ysdst000rqvek4j5801yk', 'Grafite Fosco', 'Grafite', '#2A2C2E', NULL, 6, 0, '2026-11-10T00:41:11.645Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdst000vqvekabsxc1i1', 'cmw9ysdst000rqvek4j5801yk', 'Preto Ônix', 'Preto Ônix', '#141414', NULL, 4, 0, '2026-11-10T00:41:11.645Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdtm0010qvek0v5b0l28', 'cmw9ysdtm000xqvekjxw3k35e', 'Terracota Vibrante', 'Terracota', '#D95829', NULL, 5, 0, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdtm0011qvekq64260go', 'cmw9ysdtm000xqvekjxw3k35e', 'Marrom Chocolate', 'Marrom Chocolate', '#3D2817', NULL, 3, 0, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdtm0012qvekad8rv9ik', 'cmw9ysdtm000xqvekjxw3k35e', 'Azul Náutico', 'Azul Náutico', '#1A365D', NULL, 2, 0, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdtm0013qveknkb9i3tn', 'cmw9ysdtm000xqvekjxw3k35e', 'Verde Oliva', 'Verde Oliva', '#4A5D3E', NULL, 2, 0, '2026-11-10T00:41:11.674Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdty0018qvekvky2npl6', 'cmw9ysdty0015qvek71z8w1ss', 'Areia / Champagne', 'Areia', '#D5C4A1', NULL, 7, 0, '2026-11-10T00:41:11.687Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdty0019qvekotrk7n4h', 'cmw9ysdty0015qvek71z8w1ss', 'Grafite Moderno', 'Grafite', '#35383B', NULL, 5, 0, '2026-11-10T00:41:11.687Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysdty001aqveklk3xg9kf', 'cmw9ysdty0015qvek71z8w1ss', 'Off-White Nobre', 'Off-White', '#F0EBE1', NULL, 3, 0, '2026-11-10T00:41:11.687Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysduc001fqvekdmix5adn', 'cmw9ysduc001cqvek5nvmr1dm', 'Preto Fosco', 'Preto Fosco', '#1C1C1C', NULL, 5, 0, '2026-11-10T00:41:11.700Z');
INSERT INTO "ProductVariant" ("id", "productId", "name", "colorName", "colorHex", "sku", "stock", "priceAdjustment", "createdAt") VALUES ('cmw9ysduc001gqvekbrtz9qxh', 'cmw9ysduc001cqvek5nvmr1dm', 'Cinza Titânio', 'Cinza Titânio', '#4A5056', NULL, 4, 0, '2026-11-10T00:41:11.700Z');

-- Inserindo 2 registros em "Order"
INSERT INTO "Order" ("id", "orderNumber", "userId", "guestName", "guestEmail", "guestPhone", "guestCpf", "status", "paymentMethod", "paymentStatus", "subtotal", "discount", "shippingCost", "total", "trackingCode", "carrierName", "shippingService", "couponCode", "shippingAddress", "addressId", "notes", "createdAt", "updatedAt") VALUES ('cmw9uj3qu002911xumuke22nw', 'EXM-10234', 'cmw9uj3ik000a11xugitf0uaa', 'Edson Silva', 'edson@outdoorstyle.com.br', '(19) 99876-5432', '123.456.789-00', 'IN_TRANSIT', 'PIX', 'APPROVED', 6015, 0, 0, 6015, 'BR-EXP-98741203', 'Transportadora Especializada Outdoor', 'Entrega Expressa Especial (Móveis Montados)', NULL, '{"street":"Av. Barão de Itapura","number":"1234","complement":"Apto 42","neighborhood":"Guanabara","city":"Campinas","state":"SP","zipCode":"13020-432"}', 'cmw9uj3ix000c11xuuoqs8yuh', 'Entregar na portaria social e acionar interfone.', '2026-11-08T14:32:00.000Z', '2026-11-09T22:42:00.247Z');
INSERT INTO "Order" ("id", "orderNumber", "userId", "guestName", "guestEmail", "guestPhone", "guestCpf", "status", "paymentMethod", "paymentStatus", "subtotal", "discount", "shippingCost", "total", "trackingCode", "carrierName", "shippingService", "couponCode", "shippingAddress", "addressId", "notes", "createdAt", "updatedAt") VALUES ('cmw9uj3rc002i11xuejdbhql2', 'EXM-10235', 'cmw9uj3ik000a11xugitf0uaa', 'Carla Vasconcellos', 'carla.v@gmail.com', '(11) 98765-1122', '234.567.890-11', 'PAID', 'CREDIT_CARD', 'APPROVED', 7898, 0, 0, 7898, NULL, 'Transportadora Especializada', 'Entrega Expressa Especial', NULL, '{"street":"Rua Oscar Freire","number":"890","neighborhood":"Jardins","city":"São Paulo","state":"SP","zipCode":"01426-001"}', NULL, NULL, '2026-11-09T10:14:00.000Z', '2026-11-09T22:42:00.264Z');

-- Inserindo 3 registros em "OrderItem"
INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "productImage", "variantName", "price", "quantity", "total") VALUES ('cmw9uj3qv002b11xu4jpbqek3', 'cmw9uj3qu002911xumuke22nw', 'cmw9uj3n0000k11xuoa7jzruk', 'cmw9uj3n0000p11xue6d677v5', 'Sofá Externo Riviera 3 Lugares', '/images/prod-sofa-riviera.jpg', 'Cor: Taupe', 5391, 1, 5391);
INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "productImage", "variantName", "price", "quantity", "total") VALUES ('cmw9uj3qv002c11xutfsiso07', 'cmw9uj3qu002911xumuke22nw', 'cmw9uj3ps001y11xuk0fc7fn6', NULL, 'Guarda-Sol Lateral Ø 3m', '/images/prod-guarda-sol-lateral.jpg', 'Cor: Bege', 624, 1, 624);
INSERT INTO "OrderItem" ("id", "orderId", "productId", "variantId", "productName", "productImage", "variantName", "price", "quantity", "total") VALUES ('cmw9uj3rc002k11xuwiyfqudz', 'cmw9uj3rc002i11xuejdbhql2', 'cmw9uj3nd000u11xushi7hx5i', NULL, 'Sofá Modular Cayenne 4 Lugares', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', 'Cor: Grafite', 7898, 1, 7898);

-- Inserindo 3 registros em "OrderStatusHistory"
INSERT INTO "OrderStatusHistory" ("id", "orderId", "status", "note", "createdAt") VALUES ('cmw9uj3qv002d11xu6dj8nmal', 'cmw9uj3qu002911xumuke22nw', 'PENDING', 'Pedido recebido com sucesso', '2026-11-08T14:32:00.000Z');
INSERT INTO "OrderStatusHistory" ("id", "orderId", "status", "note", "createdAt") VALUES ('cmw9uj3qv002e11xuue1y8bhm', 'cmw9uj3qu002911xumuke22nw', 'PAID', 'Pagamento Pix aprovado instantaneamente via Mercado Pago', '2026-11-08T14:33:15.000Z');
INSERT INTO "OrderStatusHistory" ("id", "orderId", "status", "note", "createdAt") VALUES ('cmw9uj3qv002f11xumhdmu4ya', 'cmw9uj3qu002911xumuke22nw', 'IN_TRANSIT', 'Carga coletada e em transferência para o centro logístico de Campinas', '2026-11-09T08:15:00.000Z');

-- Inserindo 1 registros em "Payment"
INSERT INTO "Payment" ("id", "orderId", "paymentMethod", "status", "transactionId", "qrCode", "qrCodeBase64", "copyPastePix", "installments", "cardLastFour", "cardBrand", "amount", "paidAt", "rawResponse", "createdAt", "updatedAt") VALUES ('cmw9uj3qv002g11xur2bzqa0x', 'cmw9uj3qu002911xumuke22nw', 'PIX', 'APPROVED', 'MP-PIX-9821839218', NULL, NULL, '00020126580014br.gov.bcb.pix0136outdoorstyle-pix-key-928152040000530398654066015.005802BR5912OutdoorStyle6008Campinas62070503***6304E8A1', 1, NULL, NULL, 6015, '2026-11-08T14:33:15.000Z', NULL, '2026-11-09T22:42:00.247Z', '2026-11-09T22:42:00.247Z');

-- Inserindo 3 registros em "Review"
INSERT INTO "Review" ("id", "productId", "userId", "userName", "userAvatar", "rating", "title", "comment", "verifiedPurchase", "active", "createdAt") VALUES ('cmw9uj3s2002n11xulz7uthip', 'cmw9uj3n0000k11xuoa7jzruk', 'cmw9uj3ik000a11xugitf0uaa', 'Edson Silva', NULL, 5, 'Qualidade excepcional!', 'O sofá é simplesmente espetacular! O acabamento da corda náutica e o toque do tecido impermeável são impecáveis. Tomou chuva e secou super rápido.', TRUE, TRUE, '2026-11-09T22:42:00.291Z');
INSERT INTO "Review" ("id", "productId", "userId", "userName", "userAvatar", "rating", "title", "comment", "verifiedPurchase", "active", "createdAt") VALUES ('cmw9uj3s2002o11xu9hlzhpur', 'cmw9uj3n0000k11xuoa7jzruk', NULL, 'Mariana Duarte', NULL, 5, 'Elegante e muito confortável', 'Comprei para a varanda integrada com a piscina. Superou todas as expectativas da família. A entrega com a equipe própria foi muito cuidadosa.', TRUE, TRUE, '2026-11-09T22:42:00.291Z');
INSERT INTO "Review" ("id", "productId", "userId", "userName", "userAvatar", "rating", "title", "comment", "verifiedPurchase", "active", "createdAt") VALUES ('cmw9uj3s2002p11xu1ltg285r', 'cmw9uj3n0000k11xuoa7jzruk', NULL, 'Ricardo Almeida', NULL, 5, 'Vale cada centavo', 'Estrutura muito firme em alumínio e cor Taupe maravilhosa ao vivo. Recomendo de olhos fechados.', TRUE, TRUE, '2026-11-09T22:42:00.291Z');

-- Inserindo 2 registros em "Favorite"
INSERT INTO "Favorite" ("id", "userId", "productId", "createdAt") VALUES ('cmw9uj3rr002l11xuqrpee18v', 'cmw9uj3ik000a11xugitf0uaa', 'cmw9uj3n0000k11xuoa7jzruk', '2026-11-09T22:42:00.279Z');
INSERT INTO "Favorite" ("id", "userId", "productId", "createdAt") VALUES ('cmw9uj3rr002m11xu13p3w6dk', 'cmw9uj3ik000a11xugitf0uaa', 'cmw9uj3ps001y11xuk0fc7fn6', '2026-11-09T22:42:00.279Z');


-- 6. Verificação final dos dados inseridos no Supabase
SELECT
  (SELECT count(*) FROM "Category") AS categories_count,
  (SELECT count(*) FROM "Product") AS products_count,
  (SELECT count(*) FROM "ProductImage") AS images_count,
  (SELECT count(*) FROM "ProductVariant") AS variants_count,
  (SELECT count(*) FROM "User") AS users_count,
  (SELECT count(*) FROM "Order") AS orders_count,
  current_user AS executed_as;
