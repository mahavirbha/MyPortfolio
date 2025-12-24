/**
 * Resume Preview Module
 * Handles resume modal preview functionality
 */

import { supportsViewTransitions } from './viewTransitions.js';

let modal = null;
let isOpen = false;

/**
 * Initialize resume preview modal
 */
export function initResumePreview() {
  modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('resume-preview-btn');
  const closeBtn = document.getElementById('resume-modal-close-btn');
  const overlay = document.getElementById('resume-modal-close');
  const iframe = modal?.querySelector('.resume-modal_iframe');

  if (!modal || !openBtn) return;

  // Open modal
  openBtn.addEventListener('click', openModal);

  // Close modal
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
  });

  // Check if iframe loads successfully (for fallback)
  if (iframe) {
    iframe.addEventListener('error', () => {
      modal.classList.add('fallback');
    });

    // For some browsers that don't trigger error event
    iframe.addEventListener('load', () => {
      try {
        // Try to access iframe content - will fail if PDF didn't load
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc || iframeDoc.body?.innerHTML === '') {
          modal.classList.add('fallback');
        }
      } catch (e) {
        // Cross-origin or PDF loaded successfully - do nothing
      }
    });
  }

  // Detect mobile devices and show fallback
  if (isMobileDevice()) {
    modal.classList.add('fallback');
  }
}

/**
 * Open the resume modal
 */
function openModal() {
  if (!modal) return;
  
  // Lazy load the iframe src when modal opens
  const iframe = modal.querySelector('.resume-modal_iframe');
  if (iframe && iframe.dataset.src && !iframe.src) {
    iframe.src = iframe.dataset.src;
  }
  
  const showModal = () => {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    isOpen = true;

    // Focus trap - focus first interactive element
    const firstFocusable = modal.querySelector('a, button');
    firstFocusable?.focus();
  };

  // Use View Transition if supported
  if (supportsViewTransitions()) {
    document.startViewTransition(showModal);
  } else {
    showModal();
  }
}

/**
 * Close the resume modal
 */
function closeModal() {
  if (!modal) return;
  
  const hideModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    isOpen = false;

    // Return focus to trigger button
    const openBtn = document.getElementById('resume-preview-btn');
    openBtn?.focus();
  };

  // Use View Transition if supported
  if (supportsViewTransitions()) {
    document.startViewTransition(hideModal);
  } else {
    hideModal();
  }
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768);
}

/**
 * Check if modal is currently open
 */
export function isModalOpen() {
  return isOpen;
}
