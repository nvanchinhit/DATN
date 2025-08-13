
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import AppLayout from '@/components/layout/AppLayout';
import { HydrationSafe } from '@/components/ui/hydration-safe';

import { AuthProvider } from '@/app/contexts/page'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hệ thống đặt lịch khám chất lượng số 1',
  description: 'Xây dựng hệ thống bán thuốc & đặt lịch khám trực tuyến',
  icons: {
    icon: 'https://png.pngtree.com/png-clipart/20230812/original/pngtree-clinic-logo-healthy-construction-vector-picture-image_10448239.png',
    shortcut: 'https://png.pngtree.com/png-clipart/20230812/original/pngtree-clinic-logo-healthy-construction-vector-picture-image_10448239.png',
    apple: 'https://png.pngtree.com/png-clipart/20230812/original/pngtree-clinic-logo-healthy-construction-vector-picture-image_10448239.png',
  },
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