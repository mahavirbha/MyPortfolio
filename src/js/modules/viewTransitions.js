/**
 * View Transitions Module
 * Handles smooth view transitions for navigation and UI changes
 */

/**
 * Check if View Transitions API is supported
 */
export function supportsViewTransitions() {
  return 'startViewTransition' in document;
}

/**
 * Navigate to section with view transition
 * @param {string} sectionId - Target section ID
 */
export function navigateWithTransition(sectionId) {
  const targetSection = document.querySelector(sectionId);
  if (!targetSection) return;

  if (supportsViewTransitions()) {
    document.startViewTransition(() => {
      scrollToSection(targetSection);
    });
  } else {
    scrollToSection(targetSection);
  }
}

/**
 * Scroll to section helper
 */
function scrollToSection(element) {
  const headerHeight = document.querySelector('.l-header')?.offsetHeight || 0;
  const targetPosition = element.offsetTop - headerHeight;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Toggle theme with view transition
 * @param {Function} toggleFn - Theme toggle function
 */
export function toggleThemeWithTransition(toggleFn) {
  if (supportsViewTransitions()) {
    document.startViewTransition(() => {
      toggleFn();
    });
  } else {
    toggleFn();
  }
}

/**
 * Filter projects with view transition
 * @param {Function} filterFn - Filter function
 */
export function filterWithTransition(filterFn) {
  if (supportsViewTransitions()) {
    document.startViewTransition(async () => {
      await filterFn();
    });
  } else {
    filterFn();
  }
}

/**
 * Open modal with view transition
 * @param {HTMLElement} modal - Modal element
 */
export function openModalWithTransition(modal) {
  if (!modal) return;

  if (supportsViewTransitions()) {
    document.startViewTransition(() => {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    });
  } else {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

/**
 * Close modal with view transition
 * @param {HTMLElement} modal - Modal element
 */
export function closeModalWithTransition(modal) {
  if (!modal) return;

  if (supportsViewTransitions()) {
    document.startViewTransition(() => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  } else {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

/**
 * Assign unique view-transition-names to project cards
 */
export function initProjectCardTransitions() {
  const cards = document.querySelectorAll('.project_card');
  cards.forEach((card, index) => {
    card.style.setProperty('--card-transition-name', `project-card-${index}`);
    card.style.viewTransitionName = `project-card-${index}`;
  });
}

/**
 * Assign unique view-transition-names to skill bars
 */
export function initSkillBarTransitions() {
  const bars = document.querySelectorAll('.skill_progress');
  bars.forEach((bar, index) => {
    bar.style.setProperty('--skill-transition-name', `skill-bar-${index}`);
    bar.style.viewTransitionName = `skill-bar-${index}`;
  });
}

/**
 * Assign unique view-transition-names to filter buttons
 */
export function initFilterTransitions() {
  const buttons = document.querySelectorAll('.projects_filter-btn');
  buttons.forEach((btn, index) => {
    btn.style.setProperty('--filter-transition-name', `filter-btn-${index}`);
  });
}

/**
 * Initialize all view transitions
 */
export function initViewTransitions() {
  if (!supportsViewTransitions()) {
    console.log('View Transitions API not supported, using fallbacks');
    return;
  }

  console.log('✨ View Transitions API enabled');

  // Initialize unique transition names
  initProjectCardTransitions();
  initSkillBarTransitions();
  initFilterTransitions();

  // Add transition class to body for CSS detection
  document.body.classList.add('view-transitions-enabled');
}
