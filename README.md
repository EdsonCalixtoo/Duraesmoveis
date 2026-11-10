# DURÃES MÓVEIS — E-COMMERCE DE MÓVEIS EXTERNOS DE ALTO PADRÃO

Sistema completo de e-commerce com design **Dark Premium**, desenvolvido em **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL / SQLite**, **Auth.js / NextAuth**, **Mercado Pago** e **Framer Motion**.

Fielmente projetado a partir da referência visual oficial contendo as 12 telas de alta fidelidade:
1. **Home (Página Inicial)**
2. **Listagem de Produtos (Catálogo / Categoria)**
3. **Página do Produto (PDP)**
4. **Carrinho de Compras (Slide-over Drawer & Página)**
5. **Checkout em Etapas (Identificação, Entrega, Pagamento Pix/Cartão, Confirmação)**
6. **Login / Cadastro**
7. **Área do Cliente (Minha Conta)**
8. **Meus Pedidos (Detalhe com Visual Stepper Tracker)**
9. **Favoritos**
10. **Sobre Nós (Institucional com Pilares)**
11. **Contato (Canais e Formulário)**
12. **Painel Administrativo Completo (/admin com Dashboard, KPIs, Gráficos e CRUDs)**
+ **Versão Mobile Totalmente Responsiva com Bottom Navigation Bar**

---

## 🎨 Identidade Visual — Dark Premium

- **Background Principal:** `#080808`
- **Background Secundário:** `#111111`
- **Cards & Superfícies:** `#1C1C1C`
- **Bordas & Divisores:** `#303030`
- **Verde Destaque Principal:** `#8CF000`
- **Verde Hover / Glow:** `#A3FF12`
- **Texto Principal:** `#FFFFFF`
- **Texto Secundário / Muted:** `#A3A3A3`

---

## 🚀 Tecnologias Utilizadas

- **Framework Web:** Next.js 14.2 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + custom dark variables & glowing utilities
- **Ícones:** Lucide React
- **ORM / Banco de Dados:** Prisma ORM com suporte nativo a PostgreSQL e SQLite
- **Autenticação:** NextAuth.js com sessões JWT seguras e RBAC (ADMIN / CUSTOMER)
- **Criptografia:** BcryptJS para hash seguro de senhas
- **Validação de Dados:** Zod em todas as rotas e formulários
- **Gerenciamento de Estado:** Zustand com persistência automática no LocalStorage para carrinho e favoritos
- **Gráficos Administrativos:** Recharts adaptado ao tema dark
- **Feedback & Notificações:** Sonner Toasts
- **Gateways & Pagamento:** Mercado Pago (Pix com EMV QRCode e Cartão até 12x)

---

## 📦 Estrutura de Diretórios

```
duraesmoveis-ecommerce/
├── prisma/
│   ├── schema.prisma            # Schema ativo (SQLite por padrão para zero-config)
│   ├── schema.postgresql.prisma # Schema pré-configurado para PostgreSQL
│   └── seed.js                  # Seed completo e realista com produtos, variantes, cupons e pedido #EXM-10234
├── public/                      # Assets estáticos
├── scripts/
│   ├── test-runner.js           # Suíte de testes automatizados dos fluxos críticos
│   └── switch-to-postgres.js    # Utilitário para alternar para PostgreSQL
├── src/
│   ├── app/
│   │   ├── admin/               # Painel Administrativo (/admin)
│   │   │   ├── page.tsx         # Dashboard com KPIs, gráfico Recharts e top produtos
│   │   │   ├── produtos/        # CRUD de produtos e estoque
│   │   │   ├── pedidos/         # Gestão de pedidos e alteração de status/rastreio
│   │   │   ├── categorias/      # Gestão de categorias
│   │   │   ├── clientes/        # Listagem e histórico de compras
│   │   │   ├── cupons/          # Gestão de cupons de desconto
│   │   │   ├── banners/         # Gestão de banners da Home
│   │   │   ├── relatorios/      # Relatórios de performance
│   │   │   └── configuracoes/   # Dados da loja, frete e chaves Mercado Pago
│   │   ├── api/                 # Route Handlers
│   │   │   ├── auth/            # NextAuth e cadastro de usuários
│   │   │   ├── checkout/process # Processamento seguro do checkout com transação Prisma
│   │   │   ├── coupons/validate # Validação de cupons e regras de compra
│   │   │   ├── cep/[cep]        # Consulta de CEP e cálculo de frete especializado
│   │   │   ├── mercadopago/     # Webhook do Mercado Pago
│   │   │   └── admin/           # APIs restritas do painel admin
│   │   ├── catalogo/            # Catálogo geral de produtos com filtros e ordenação
│   │   ├── categoria/[slug]/    # Filtro dinâmico por categoria
│   │   ├── produto/[slug]/      # PDP com zoom, galeria, variantes, cálculo de CEP e tabs
│   │   ├── carrinho/            # Carrinho de compras com cupom e totais
│   │   ├── checkout/            # Stepper de checkout (Identificação, Entrega, Pagamento, Confirmação)
│   │   ├── checkout/sucesso/    # Confirmação com animação de confetti e tracker
│   │   ├── login/               # Autenticação dark premium com tabs Entrar/Criar conta
│   │   ├── conta/               # Área do cliente (Minha Conta, Pedidos, Favoritos, Endereços, Dados)
│   │   ├── sobre/               # Sobre nós institucional com pilares de qualidade
│   │   ├── contato/             # Central de atendimento com WhatsApp, e-mail e formulário
│   │   ├── faq/                 # Perguntas frequentes com acordeão interativo
│   │   ├── politica-de-entrega/ # Política de frete e prazos
│   │   ├── politica-de-privacidade/ # LGPD complacente
│   │   ├── termos-de-uso/       # Termos de serviço
│   │   └── trocas-e-devolucoes/ # CDC e garantia de 5 anos
│   ├── components/
│   │   ├── admin/               # Componentes do painel administrativo
│   │   ├── catalog/             # Filtros interativos e drawer mobile
│   │   ├── common/              # Header, Footer, Logo, ProductCard, TopBenefitBar, MobileBottomNav, CartDrawer
│   │   ├── home/                # HeroSlider, CategoryGrid, CommercialBenefits, BestSellers, Newsletter...
│   │   └── product/             # Gallery, ShippingBox, Tabs, VariantSelector
│   ├── lib/
│   │   ├── auth.ts              # Opções do NextAuth
│   │   ├── mercadopago.ts       # Serviço Mercado Pago (Pix EMV QRCode e Cartão)
│   │   ├── prisma.ts            # Singleton Prisma Client
│   │   ├── shipping.ts          # Cálculo de frete especializado e ViaCEP
│   │   ├── utils.ts             # Formatação de BRL, CPF, CEP, telefone e datas
│   │   └── validations.ts       # Schemas Zod de validação
│   ├── store/
│   │   ├── useCartStore.ts      # Store persistente Zustand do carrinho
│   │   └── useFavoritesStore.ts # Store persistente Zustand de favoritos
│   └── types/                   # Tipagens TypeScript completas
├── .env.example
└── package.json
```

---

## ⚡ Como Executar o Projeto

### 1. Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou pnpm

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados
O projeto já vem configurado com SQLite local para inicialização instantânea sem necessidade de instalar ou configurar servidores externos.

Para gerar o cliente Prisma e popular os dados de demonstração:
```bash
npm run prisma:push
npm run prisma:seed
```

### 4. Execução dos Testes Automatizados
```bash
npm test
```
*Executa 18 asserções de integridade cobrindo conexão, produtos, pedidos com stepper, cupons, autenticação e baixa de estoque.*

### 5. Execução em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse em seu navegador: **`http://localhost:3000`**

### 6. Build de Produção
```bash
npm run build
npm start
```

---

## 🔑 Credenciais Demonstrativas de Acesso

O banco de dados vem pré-populado com os usuários de teste:

### Administrador (Acesso ao `/admin` e à loja):
- **E-mail:** `admin@outdoorstyle.com.br`
- **Senha:** `admin123456`
- **Permissões:** Acesso total ao Dashboard, Gestão de Pedidos, Produtos, Categorias, Clientes, Cupons, Banners e Configurações.

### Cliente (Acesso à Área do Cliente `/conta` e `/checkout`):
- **E-mail:** `edson@outdoorstyle.com.br`
- **Senha:** `cliente123`
- **Histórico:** Possui o pedido de exemplo **#EXM-10234** ("Em transporte") e produtos salvos nos favoritos.

---

## 🏷️ Cupons de Desconto Cadastrados

- **`BEMVINDO10`** — 10% de desconto no pedido (mínimo R$ 500)
- **`OUTDOOR15`** — 15% de desconto especial (mínimo R$ 2.000)
- **`VERAO500`** — R$ 500,00 OFF fixo em compras acima de R$ 5.000

---

## 🔌 Integrações e Configurações de Produção

### 1. Mercado Pago (Pix & Cartão de Crédito)
O sistema possui a camada completa de integração com Mercado Pago implementada em `src/lib/mercadopago.ts` e route handler de Webhooks em `src/app/api/mercadopago/webhook/route.ts`.
- **Modo Sandbox / Desenvolvimento:** O sistema gera automaticamente o payload EMV Pix com código Copia e Cola e renderiza dinamicamente a imagem do QR Code em base64.
- **Modo Produção:** Basta preencher no arquivo `.env`:
  ```env
  MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
  MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
  MERCADOPAGO_WEBHOOK_SECRET="whsec_..."
  ```

### 2. Consulta de CEP e Frete Especializado
- Integração ativa com a API pública do ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) para autopreenchimento de logradouro, bairro, cidade e UF.
- Motor de cálculo logístico customizado para móveis externos volumosos (`src/lib/shipping.ts`), com regras de prazo e tarifação regional brasileira.
- Regra comercial de **Frete Grátis Especial** ativada para pedidos com valor subtotal a partir de **R$ 2.999,00**.

### 3. Migração para PostgreSQL (Produção)
Para rodar em instâncias PostgreSQL no Supabase, Neon, AWS RDS, Railway ou Render:
1. Altere no `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/outdoorstyle?schema=public"
   ```
2. Execute o comando utilitário:
   ```bash
   node scripts/switch-to-postgres.js
   npx prisma db push
   npm run prisma:seed
   ```

