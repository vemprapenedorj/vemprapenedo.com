import React from 'react';
import { motion } from 'motion/react';
import { useFirstHydration } from '../hooks/useFirstHydration';
import { BootstrapManager } from '../utils/bootstrapManager';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const isFirstLoad = useFirstHydration();
  
  React.useEffect(() => {
    if (isFirstLoad) {
      BootstrapManager.waitForAppReady().then(() => {
        BootstrapManager.signalReady();
      });
    }
  }, [isFirstLoad]);
  
  return (
    <motion.div
      initial={isFirstLoad ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
