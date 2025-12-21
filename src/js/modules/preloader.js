/**
 * Preloader Module
 * Loading animation until all assets are ready
 */

/**
 * Initialize preloader
 */
export function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const progressBar = document.querySelector('.preloader_progress-bar');
  
  if (!preloader) {
    // No preloader, just mark as loaded
    document.body.classList.add('loaded');
    return;
  }

  // Track loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, 100);

  // Hide preloader when page is fully loaded
  window.addEventListener('load', () => {
    clearInterval(interval);
    
    // Complete the progress bar
    if (progressBar) {
      progressBar.style.width = '100%';
    }

    // Hide preloader after animation
    setTimeout(() => {
      preloader.classList.add('hidden');
      
      // Enable scrolling and show content
      document.body.classList.add('loaded');
      document.body.style.overflow = '';
      
      // Remove preloader from DOM after transition
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 500);
  });

  // Prevent scrolling while loading
  document.body.style.overflow = 'hidden';
}

/**
 * Show preloader (for page transitions)
 */
export function showPreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hide preloader
 */
export function hidePreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
