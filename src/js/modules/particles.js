/**
 * Particles Module
 * tsParticles configuration for interactive hero background
 */

import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

/**
 * Initialize particles in hero section
 */
export async function initParticles() {
  await loadSlim(tsParticles);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  await tsParticles.load({
    id: 'particles-js',
    options: getParticleConfig(isDark)
  });

  // Auto-add particles every 3 seconds
  startAutoParticles();

  // Update particles on theme change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        const newTheme = document.documentElement.getAttribute('data-theme');
        updateParticleColors(newTheme === 'dark');
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

/**
 * Auto-add particles at interval
 */
let autoParticleInterval = null;

function startAutoParticles() {
  // Add particles every 3 seconds
  autoParticleInterval = setInterval(() => {
    const container = tsParticles.domItem(0);
    if (container) {
      // Add 2-3 particles at random positions
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        container.particles.addParticle({
          x: Math.random() * container.canvas.size.width,
          y: Math.random() * container.canvas.size.height
        });
      }
    }
  }, 1000);
}

/**
 * Stop auto particles (for cleanup)
 */
export function stopAutoParticles() {
  if (autoParticleInterval) {
    clearInterval(autoParticleInterval);
    autoParticleInterval = null;
  }
}

/**
 * Get particle configuration
 */
function getParticleConfig(isDark) {
  const primaryColor = isDark ? '#ff6b4a' : '#cc4b2c';
  const secondaryColor = isDark ? '#ff8a6b' : '#662616';

  // Reduce visibility in light mode for better text readability
  const particleOpacity = isDark ? { min: 0.3, max: 0.7 } : { min: 0.15, max: 0.35 };
  const linkOpacity = isDark ? 0.3 : 0.15;
  const particleCount = isDark ? 60 : 40;

  return {
    fullScreen: false,
    background: {
      color: {
        value: 'transparent'
      }
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 3
        },
        repulse: {
          distance: 120,
          duration: 0.4
        },
        grab: {
          distance: 150,
          links: {
            opacity: 0.5
          }
        }
      }
    },
    particles: {
      color: {
        value: [primaryColor, secondaryColor]
      },
      links: {
        color: primaryColor,
        distance: 150,
        enable: true,
        opacity: linkOpacity,
        width: 1
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce'
        },
        random: true,
        speed: 0.8,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 900
        },
        value: particleCount
      },
      opacity: {
        value: particleOpacity,
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.1
        }
      },
      shape: {
        type: ['circle', 'triangle']
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.5
        }
      }
    },
    detectRetina: true
  };
}

/**
 * Update particle colors on theme change
 */
async function updateParticleColors(isDark) {
  const container = tsParticles.domItem(0);
  if (!container) return;

  const primaryColor = isDark ? '#ff6b4a' : '#cc4b2c';
  const secondaryColor = isDark ? '#ff8a6b' : '#662616';

  await container.options.particles.color.load({
    value: [primaryColor, secondaryColor]
  });
  
  await container.options.particles.links.load({
    color: primaryColor
  });

  container.refresh();
}
