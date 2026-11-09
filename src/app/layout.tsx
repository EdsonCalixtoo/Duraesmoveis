import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/common/Providers';
import CartDrawer from '@/components/common/CartDrawer';
import ShopChrome from '@/components/common/ShopChrome';

export const metadata: Metadata = {
  title: 'OutdoorStyle — Móveis para Áreas Externas de Alto Padrão',
  description:
    'E-commerce de móveis para áreas externas. Sofás, poltronas, espreguiçadeiras e ombrelones com design contemporâneo, resistência ao tempo e máxima sofisticação.',
  keywords: [
    'móveis externos',
    'sofá para jardim',
    'corda náutica',
    'espreguiçadeira piscina',
    'móveis de luxo',
    'outdoor style',
  ],
  authors: [{ name: 'OutdoorStyle' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'OutdoorStyle — Móveis Externos Premium',
    description: 'Transforme seu espaço externo em um ambiente incrível.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'OutdoorStyle',
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
