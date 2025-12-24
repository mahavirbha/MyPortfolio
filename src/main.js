/**
 * Main Entry Point
 * Initializes all modules and components
 */

// Styles
import './styles/main.css';

// Modules
import { initNavigation, initBackToTop, initSmoothScroll } from './js/modules/navigation.js';
import { initTheme } from './js/modules/theme.js';
import { initSpeech } from './js/modules/speech.js';
import { initScrollEffects, initHomeAnimations } from './js/modules/scrollEffects.js';
import { initParticles } from './js/modules/particles.js';
import { initPreloader } from './js/modules/preloader.js';
import { initResumePreview } from './js/modules/resumePreview.js';
import { initViewTransitions } from './js/modules/viewTransitions.js';

// Components
import { initThreeScene } from './js/components/ThreeScene.js';
import { initProjects } from './js/components/ProjectCard.js';
import { initSkills } from './js/components/SkillBar.js';
import { initCustomCursor } from './js/components/CustomCursor.js';
import { initEducation } from './js/components/Education.js';

// Contact form handling
import { initContactForm } from './js/modules/contact.js';

/**
 * Initialize application
 */
function init() {
  // Initialize preloader first
  initPreloader();
  
  // Theme (before other visual elements)
  initTheme();
  
  // Navigation
  initNavigation();
  initSmoothScroll();
  initBackToTop();
  
  // Initialize components that render content
  initSkills();
  initProjects();
  initEducation();
  
  // Visual effects (after DOM content is ready)
  initThreeScene();
  initParticles();
  initHomeAnimations();
  initScrollEffects();
  
  // Interactive features
  initCustomCursor();
  initSpeech();
  initContactForm();
  initResumePreview();
  
  // Initialize View Transitions (after content is rendered)
  initViewTransitions();
  
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  console.log('🚀 Portfolio initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
