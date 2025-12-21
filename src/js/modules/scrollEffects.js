/**
 * Scroll Effects Module
 * GSAP + ScrollTrigger animations for section reveals and skill bars
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all scroll-triggered animations
 */
export function initScrollEffects() {
  // Wait for DOM to be ready
  initSectionReveals();
  initSkillBarAnimations();
  initProjectCardAnimations();
  initEducationTimeline();
  initTextReveals();
  initParallaxEffects();
}

/**
 * Section reveal animations
 */
function initSectionReveals() {
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    gsap.fromTo(
      section.querySelector('.section-title'),
      { 
        opacity: 0, 
        y: 50 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      section.querySelector('.section-subtitle'),
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Skill bar animations - animate width on scroll
 */
function initSkillBarAnimations() {
  const skillBars = document.querySelectorAll('.skill_progress');

  skillBars.forEach(bar => {
    const percentage = bar.getAttribute('data-percentage') || bar.style.width;
    
    gsap.fromTo(
      bar,
      { width: '0%' },
      {
        width: percentage,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Project card staggered animations
 */
function initProjectCardAnimations() {
  const projectCards = document.querySelectorAll('.project_card');

  gsap.fromTo(
    projectCards,
    {
      opacity: 0,
      y: 60,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects_container',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/**
 * Education timeline animations
 */
function initEducationTimeline() {
  const educationItems = document.querySelectorAll('.education_item');

  educationItems.forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Text reveal animations
 */
function initTextReveals() {
  const textElements = document.querySelectorAll('[data-animate="text"]');

  textElements.forEach(el => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/**
 * Parallax effects
 */
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  parallaxElements.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
    
    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/**
 * Home section animations (called separately for hero)
 */
export function initHomeAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.home_img', 
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8 }
  )
  .fromTo('.home_title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.4'
  )
  .fromTo('.home_profession',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.3'
  )
  .fromTo('.home_social-link',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
    '-=0.2'
  )
  .fromTo('.home_button .button',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
    '-=0.2'
  );

  return tl;
}
