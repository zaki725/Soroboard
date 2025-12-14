'use client';

import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/contexts/UserContext';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <BreadcrumbProvider>
        <Toaster position="top-right" />
        {children}
      </BreadcrumbProvider>
    </UserProvider>
  );
}

