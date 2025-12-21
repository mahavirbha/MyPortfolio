/**
 * Custom Cursor Component
 * Interactive cursor that responds to hoverable elements
 */

let cursor, cursorFollower;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

/**
 * Initialize custom cursor
 */
export function initCustomCursor() {
  // Don't initialize on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }

  createCursorElements();
  initCursorListeners();
  animateCursor();
}

/**
 * Create cursor DOM elements
 */
function createCursorElements() {
  // Main cursor dot
  cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  // Cursor follower ring
  cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);
}

/**
 * Initialize cursor event listeners
 */
function initCursorListeners() {
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '0.5';
  });

  // Hover states for interactive elements
  const hoverElements = document.querySelectorAll(
    'a, button, .nav_toggle, .project_card, input, textarea, [data-cursor-hover]'
  );

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });

  // Click states
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
    cursorFollower.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
    cursorFollower.classList.remove('clicking');
  });

  // Special states for links
  const links = document.querySelectorAll('a[href], .project_card');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.classList.add('link-hover');
    });
    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('link-hover');
    });
  });
}

/**
 * Animate cursor with smooth following
 */
function animateCursor() {
  // Immediate cursor position
  cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;

  // Smooth follower position
  followerX += (cursorX - followerX) * 0.15;
  followerY += (cursorY - followerY) * 0.15;
  cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

  requestAnimationFrame(animateCursor);
}

/**
 * Update hover listeners (call after dynamic content loads)
 */
export function updateCursorHoverListeners() {
  const newElements = document.querySelectorAll(
    'a:not([data-cursor-init]), button:not([data-cursor-init]), .project_card:not([data-cursor-init])'
  );

  newElements.forEach(el => {
    el.setAttribute('data-cursor-init', 'true');
    
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hover');
      cursorFollower?.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hover');
      cursorFollower?.classList.remove('hover');
    });
  });
}
