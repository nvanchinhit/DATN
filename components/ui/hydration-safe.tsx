'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function HydrationSafe({ children, fallback }: HydrationSafeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback ? <>{fallback}</> : <div suppressHydrationWarning />;
  }

  return <>{children}</>;
} 