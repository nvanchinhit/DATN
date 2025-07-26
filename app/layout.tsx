
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import AppLayout from '@/components/layout/AppLayout';
import { HydrationSafe } from '@/components/ui/hydration-safe';

import { AuthProvider } from '@/app/contexts/page'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TDCARE',
  description: 'Xây dựng hệ thống bán thuốc & đặt lịch khám trực tuyến',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HydrationSafe>
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </HydrationSafe>
        </ThemeProvider>
      </body>
    </html>
  );
}