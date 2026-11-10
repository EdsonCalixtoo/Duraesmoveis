import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/common/Providers';
import CartDrawer from '@/components/common/CartDrawer';
import ShopChrome from '@/components/common/ShopChrome';

export const metadata: Metadata = {
  title: 'Durães Móveis — Móveis para Áreas Externas de Alto Padrão',
  description:
    'Durães Móveis: E-commerce especializado em móveis para áreas externas. Sofás, poltronas, espreguiçadeiras e conjuntos de jantar com design contemporâneo, resistência ao tempo e máxima sofisticação.',
  keywords: [
    'durães móveis',
    'duraes moveis',
    'móveis externos',
    'sofá para jardim',
    'corda náutica',
    'espreguiçadeira piscina',
    'móveis de luxo',
  ],
  authors: [{ name: 'Durães Móveis' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Durães Móveis — Móveis Externos Premium',
    description: 'Transforme seu espaço externo com a elegância incomparável da Durães Móveis.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Durães Móveis',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className="bg-[#080808] text-white min-h-screen flex flex-col selection:bg-[#8CF000] selection:text-black">
        <Providers>
          <ShopChrome>{children}</ShopChrome>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
