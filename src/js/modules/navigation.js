/**
 * Navigation Module
 * Handles mobile menu, scroll spy, and active link highlighting
 */

export function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav_link');

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu?.classList.add('show-menu');
    });
  }

  // Close mobile menu
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu?.classList.remove('show-menu');
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('show-menu');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('show-menu')) {
      if (!navMenu.contains(e.target) && !navToggle?.contains(e.target)) {
        navMenu.classList.remove('show-menu');
      }
    }
  });

  // Initialize scroll spy
  initScrollSpy(navLinks);
}

/**
 * Scroll Spy - Highlights active nav link based on scroll position
 */
function initScrollSpy(navLinks) {
  const sections = document.querySelectorAll('section[id]');
  
  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      const navLink = document.querySelector(`.nav_link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink?.classList.add('active-link');
      } else {
        navLink?.classList.remove('active-link');
      }
    });
  }

  window.addEventListener('scroll', scrollActive);
  
  // Run once on load
  scrollActive();
}

/**
 * Back to Top Button
 */
export function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerHeight = document.querySelector('.l-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
