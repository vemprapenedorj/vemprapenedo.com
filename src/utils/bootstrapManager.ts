export const BootstrapManager = {
  async waitForAppReady(): Promise<void> {
    // 1. Wait for web fonts to be completely loaded in the browser
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading failed or timed out:', e);
      }
    }
    
    // 2. Wait for critical header or hero images above the fold to load
    if (typeof document !== 'undefined') {
      await new Promise<void>((resolve) => {
        const images = Array.from(
          document.querySelectorAll('header img, section img[fetchpriority="high"], section.relative img')
        );
        
        if (images.length === 0) {
          resolve();
          return;
        }
        
        let loadedCount = 0;
        const total = images.length;
        
        const checkDone = () => {
          loadedCount++;
          if (loadedCount >= total) {
            resolve();
          }
        };

        images.forEach((img) => {
          const htmlImg = img as HTMLImageElement;
          if (htmlImg.complete) {
            checkDone();
          } else {
            htmlImg.addEventListener('load', checkDone);
            htmlImg.addEventListener('error', checkDone); // resolve anyway on error to prevent blocking
          }
        });
      });
    }

    // 3. Wait for multiple frames to guarantee React layout has stabilized and painted
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  },

  signalReady(): void {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('penedo-app-ready'));
    }
  }
};
