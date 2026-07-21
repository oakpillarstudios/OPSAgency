'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from '../context/ToastContext';
import { trackPageView } from '../lib/gtag';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'mock_google_oauth_client_id_for_dev';

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

