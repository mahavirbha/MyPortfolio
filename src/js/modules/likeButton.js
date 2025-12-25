/**
 * Like Button Module
 * Interactive heart button with Google Sign-In, Email Notification via EmailJS & Auto-fill Contact Form
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, query, collection, getDocs, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";

// EmailJS Configuration (Get these from https://dashboard.emailjs.com)
const EMAILJS_PUBLIC_KEY = '2zd_AmlssdRBW_srV'; // Replace with your public key
const EMAILJS_SERVICE_ID = 'service_udv0509'; // Service ID you create in EmailJS
const EMAILJS_TEMPLATE_ID = 'template_puwirgh'; // Template ID you create

const LIKES_COLLECTION = 'likes';

// Local state
let localCount = 0;
let db;
let auth;

/**
 * Initialize EmailJS (already loaded from HTML)
 */
function initEmailJS() {
  return new Promise((resolve) => {
    // EmailJS is loaded from index.html, just need to init
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('✅ EmailJS initialized');
      resolve();
    } else {
      // Wait for it to be available
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof emailjs !== 'undefined') {
          clearInterval(checkInterval);
          emailjs.init(EMAILJS_PUBLIC_KEY);
          console.log('✅ EmailJS initialized after wait');
          resolve();
        } else if (attempts >= 50) {
          clearInterval(checkInterval);
          console.warn('⚠️ EmailJS not available');
          resolve();
        }
      }, 100);
    }
  });
}

/**
 * Initialize the like button (footer, header, sidebar)
 */
export async function initLikeButton() {
  const likeButtons = document.querySelectorAll('.js-like-btn');
  
  if (likeButtons.length === 0) return;

  // Show loading state initially
  likeButtons.forEach(btn => btn.classList.add('loading'));

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  // Set auth persistence to local (survives page refresh)
  await setPersistence(auth, browserLocalPersistence);

  // Initialize EmailJS and wait for it to load
  await initEmailJS();

  // Set initial placeholder for all like counts
  document.querySelectorAll('.js-like-count').forEach(el => el.textContent = '...');

  // Fetch current count
  await fetchLikeCount();

  // Wait for auth state to be ready and check like status
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const hasLiked = await checkUserLikeStatusByEmail(user.email);
        if (hasLiked) {
          // Ensure buttons show liked state
          likeButtons.forEach(btn => {
            btn.classList.remove('loading');
            btn.classList.add('liked');
          });
        } else {
          // Remove loading state for unliked buttons
          likeButtons.forEach(btn => btn.classList.remove('loading'));
        }
      } else {
        // No user signed in, remove loading state
        likeButtons.forEach(btn => btn.classList.remove('loading'));
      }
      unsubscribe();
      resolve();
    });
  });

  // Handle click on all buttons
  likeButtons.forEach(btn => {
    btn.addEventListener('click', handleLikeClick);
  });
}

/**
 * Check if user has already liked (from Firestore by email)
 */
async function checkUserLikeStatusByEmail(email) {
  try {
    // Use email as document ID (sanitized)
    const emailKey = email.replace(/[.#$\/\[\]]/g, '_');
    const likeDoc = await getDoc(doc(db, LIKES_COLLECTION, emailKey));
    if (likeDoc.exists()) {
      document.querySelectorAll('.js-like-btn').forEach(btn => {
        btn.classList.add('liked');
      });
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not check user like status:', error);
    return false;
  }
}

/**
 * Fetch the current like count from likes collection
 */
async function fetchLikeCount() {
  const countElements = document.querySelectorAll('.js-like-count');
  
  try {
    // Count documents in likes collection
    const likesCollection = collection(db, LIKES_COLLECTION);
    const snapshot = await getCountFromServer(likesCollection);
    localCount = snapshot.data().count;
    
    countElements.forEach(el => {
      if (el.id === 'like-count') {
        animateCount(el, localCount);
      } else {
        el.textContent = formatCount(localCount);
      }
    });
  } catch (error) {
    console.warn('Could not fetch like count:', error);
    countElements.forEach(el => el.textContent = '0');
  }
  // Remove placeholder if still present after fetch
  countElements.forEach(el => {
    if (el.textContent === '...') el.textContent = '0';
  });
}

/**
 * Handle the like button click
 */
async function handleLikeClick(e) {
  const likeButtons = document.querySelectorAll('.js-like-btn');

  // Check if already liked (button has 'liked' class)
  if (likeButtons[0]?.classList.contains('liked')) {
    // Shake all buttons
    likeButtons.forEach(btn => btn.classList.add('shake'));
    setTimeout(() => {
      likeButtons.forEach(btn => btn.classList.remove('shake'));
    }, 500);
    showToast('You have already liked this portfolio! 💖', 'info');
    return;
  }

  // Show loading state on all buttons
  likeButtons.forEach(btn => btn.classList.add('loading'));

  try {
    // Trigger Google Sign-In
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Extract user info
    const userData = {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      email: user.email || '',
      photoURL: user.photoURL || '',
      likedAt: new Date().toISOString()
    };

    // Check if this email has already liked (Firestore check)
    const emailKey = userData.email.replace(/[.#$\/\[\]]/g, '_');
    const existingLike = await getDoc(doc(db, LIKES_COLLECTION, emailKey));
    
    if (existingLike.exists()) {
      // Already liked with this email
      likeButtons.forEach(btn => {
        btn.classList.remove('loading');
        btn.classList.add('liked');
      });
      showToast('This email has already liked! 💖', 'info');
      return;
    }

    // Mark as liked
    likeButtons.forEach(btn => {
      btn.classList.remove('loading');
      btn.classList.add('liked');
    });

    // Increment count
    localCount++;
    const countElements = document.querySelectorAll('.js-like-count');
    countElements.forEach(el => {
      if (el.id === 'like-count') {
        animateCount(el, localCount);
      } else {
        el.textContent = formatCount(localCount);
      }
    });

    // Create heart burst animation on the clicked button
    const targetButton = e?.currentTarget || likeButtons[0];
    createHeartBurst(targetButton);

    // Store like in Firestore (using email as key to prevent duplicate likes)
    await setDoc(doc(db, LIKES_COLLECTION, emailKey), userData);
    
    // Refresh count after storing
    await fetchLikeCount();

    // Send thank you email to user
    await sendEmailNotification(userData);

    // Auto-fill contact form
    autoFillContactForm(userData);

    // Scroll to contact section
    scrollToContact();

    // Show success message
    showToast(`Thanks for liking, ${userData.name.split(' ')[0]}! 🎉`, 'success');

  } catch (error) {
    likeButtons.forEach(btn => btn.classList.remove('loading'));
    
    if (error.code === 'auth/popup-closed-by-user') {
      showToast('Sign-in cancelled. Please try again!', 'warning');
    } else if (error.code === 'auth/popup-blocked') {
      showToast('Popup blocked! Please allow popups for this site.', 'error');
    } else {
      console.error('Like error:', error);
      showToast('Something went wrong. Please try again!', 'error');
    }
  }
}

/**
 * Send thank you email to the user who liked
 */
async function sendEmailNotification(userData) {
  try {
    // Wait for EmailJS to be ready (with increased timeout)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds (50 × 100ms)
    
    while (attempts < maxAttempts) {
      if (typeof emailjs !== 'undefined') {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (typeof emailjs === 'undefined') {
      console.error('EmailJS library not available after waiting');
      showToast('Email service temporarily unavailable', 'warning');
      return;
    }

    console.log('Sending email with EmailJS...');
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: userData.email,
        user_name: userData.name,
        user_photo: userData.photoURL || 'No photo',
        liked_at: new Date(userData.likedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    );
    
    console.log('✅ Thank you email sent successfully to', userData.email, result);
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
  }
}

/**
 * Auto-fill contact form with user data
 */
function autoFillContactForm(userData) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (nameInput) {
    nameInput.value = userData.name;
    nameInput.classList.add('autofilled');
  }

  if (emailInput) {
    emailInput.value = userData.email;
    emailInput.classList.add('autofilled');
  }

  setTimeout(() => {
    if (messageInput) {
      messageInput.focus();
      messageInput.placeholder = `Hi Mahavirsinh! I just liked your portfolio...`;
    }
  }, 800);
}

/**
 * Scroll to contact section
 */
function scrollToContact() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    setTimeout(() => {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.like-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `like-toast like-toast--${type}`;
  toast.innerHTML = `
    <span class="like-toast_message">${message}</span>
    <button class="like-toast_close" aria-label="Close">×</button>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  toast.querySelector('.like-toast_close').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Animate the count number
 */
function animateCount(element, targetCount) {
  const currentCount = parseInt(element.textContent) || 0;
  const duration = 500;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(currentCount + (targetCount - currentCount) * easeProgress);
    
    element.textContent = formatCount(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Format count (e.g., 1.2k for 1200)
 */
function formatCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

/**
 * Create floating hearts burst animation
 */
function createHeartBurst(button) {
  const rect = button.getBoundingClientRect();
  const colors = ['#cc4b2c', '#ff6b4a', '#ff8a70', '#e55039'];
  
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤';
    heart.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      font-size: ${12 + Math.random() * 8}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events: none;
      z-index: 9999;
      animation: floatHeart 1s ease-out forwards;
      --tx: ${(Math.random() - 0.5) * 100}px;
      --ty: ${-50 - Math.random() * 50}px;
    `;
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1000);
  }
}

export default { initLikeButton };
