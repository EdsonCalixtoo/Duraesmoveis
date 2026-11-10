'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C1C1C',
            color: '#FFFFFF',
            border: '1px solid #303030',
          },
        }}
      />
    </SessionProvider>
  );
}

