import { useState, useEffect } from 'react';

let globalHydrated = false;

export function useFirstHydration() {
  const [isHydrated, setIsHydrated] = useState(globalHydrated);

  useEffect(() => {
    globalHydrated = true;
    setIsHydrated(true);
  }, []);

  return !isHydrated;
}
