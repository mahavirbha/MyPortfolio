import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

const STORAGE_KEY = 'portfolio_liked';
const COLLECTION = 'portfolio';
const DOC_ID = 'likeCount';

// Local count for UI
let localCount = 0;
let db;

/**
 * Initialize the like button
 */
export async function initLikeButton() {
  const likeButton = document.getElementById('like-button');
  const likeCount = document.getElementById('like-count');
  if (!likeButton || !likeCount) return;

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // Check if already liked
  const hasLiked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (hasLiked) {
    likeButton.classList.add('liked');
  }

  // Fetch current count
  await fetchLikeCount();

  // Handle click
  likeButton.addEventListener('click', handleLikeClick);
}

/**
 * Fetch the current like count from storage
 */
async function fetchLikeCount() {
  const likeCount = document.getElementById('like-count');
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      localCount = docSnap.data().count || 0;
      animateCount(likeCount, localCount);
    } else {
      // Create the doc if it doesn't exist
      await setDoc(docRef, { count: 0 });
      localCount = 0;
      likeCount.textContent = '0';
    }
  } catch (error) {
    console.warn('Could not fetch like count:', error);
    likeCount.textContent = '0';
  }
}

/**
 * Handle the like button click
 */
async function handleLikeClick() {
  const likeButton = document.getElementById('like-button');
  const likeCount = document.getElementById('like-count');
  const hasLiked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (hasLiked) {
    likeButton.classList.add('shake');
    setTimeout(() => likeButton.classList.remove('shake'), 500);
    return;
  }
  localStorage.setItem(STORAGE_KEY, 'true');
  likeButton.classList.add('liked');
  localCount++;
  animateCount(likeCount, localCount);
  createHeartBurst(likeButton);
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    await updateDoc(docRef, { count: increment(1) });
    // Optionally, fetch the new count again for accuracy
    await fetchLikeCount();
  } catch (error) {
    console.warn('Could not update like count remotely');
  }
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
