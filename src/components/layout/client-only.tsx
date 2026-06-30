'use client';

import { useEffect, useState } from 'react';

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted && process.env.NODE_ENV === 'development') {
    return null; // Or a loading spinner if preferred
  }

  return <>{children}</>;
}
