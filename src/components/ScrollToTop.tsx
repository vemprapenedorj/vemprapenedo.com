import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className="fixed bottom-8 right-8 z-[90] p-4 bg-penedo-emerald text-white rounded-full shadow-2xl shadow-penedo-emerald/30 hover:bg-penedo-forest border-2 border-white/20 transition-all flex items-center justify-center group cursor-pointer"
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} className="group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
