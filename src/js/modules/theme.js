/**
 * Theme Module
 * Handles dark/light mode toggle with localStorage persistence
 */

import { supportsViewTransitions } from './viewTransitions.js';

const THEME_KEY = 'portfolio-theme';

export function initTheme() {
  const themeToggle = document.querySelectorAll('[data-theme-toggle]');
  
  // Get saved theme or default to light
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(savedTheme);

  // Theme toggle click handlers
  themeToggle.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Use View Transition if supported
      if (supportsViewTransitions()) {
        document.startViewTransition(() => {
          setTheme(newTheme);
          localStorage.setItem(THEME_KEY, newTheme);
        });
      } else {
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
      }
    });
  });

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Set theme and update UI
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons(theme);
}

/**
 * Update theme toggle icons
 */
function updateThemeIcons(theme) {
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  
  themeToggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    }
    
    const text = toggle.querySelector('span');
    if (text) {
      text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  });
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}
