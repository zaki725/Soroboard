'use client';

import { Toaster } from 'react-hot-toast';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BreadcrumbProvider>
      <Toaster position="top-right" />
      {children}
    </BreadcrumbProvider>
  );
}
