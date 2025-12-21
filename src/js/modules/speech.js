/**
 * Speech Module
 * Text-to-speech functionality for accessibility and interaction
 */

import personalData from '@data/personal.json';

let currentUtterance = null;

/**
 * Initialize all speech features
 */
export function initSpeech() {
  // Welcome message on page load (optional - can be enabled by user)
  initWelcomeSpeech();
  
  // About section speak button
  initAboutSpeech();
  
  // Social link announcements
  initSocialSpeech();
  
  // Resume download announcement
  initResumeSpeech();
}

/**
 * Welcome speech on page load
 */
function initWelcomeSpeech() {
  // Only speak if user has interacted before (stored preference)
  const shouldSpeak = localStorage.getItem('speech-enabled') === 'true';
  
  if (shouldSpeak && 'speechSynthesis' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        speak(personalData.speech.welcome);
      }, 1000);
    });
  }
}

/**
 * About section text-to-speech
 */
function initAboutSpeech() {
  const speakButton = document.querySelector('.speakAbout');
  
  if (speakButton) {
    speakButton.addEventListener('click', () => {
      if (currentUtterance && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return;
      }
      speak(personalData.speech.about);
    });
  }
}

/**
 * Social link announcements
 */
function initSocialSpeech() {
  const linkedinLinks = document.querySelectorAll('.linkedin, [data-social="linkedin"]');
  const githubLinks = document.querySelectorAll('.github, [data-social="github"]');

  linkedinLinks.forEach(link => {
    link.addEventListener('click', () => {
      speak(personalData.speech.linkedin);
    });
  });

  githubLinks.forEach(link => {
    link.addEventListener('click', () => {
      speak(personalData.speech.github);
    });
  });
}

/**
 * Resume download announcement
 */
function initResumeSpeech() {
  const resumeLinks = document.querySelectorAll('.resumeDownload, [data-action="resume"]');
  
  resumeLinks.forEach(link => {
    link.addEventListener('click', () => {
      speak(personalData.speech.resume);
    });
  });
}

/**
 * Core speak function
 */
function speak(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 0.8;

  // Try to use a good English voice
  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(voice => 
    voice.lang.includes('en') && voice.name.includes('Google')
  ) || voices.find(voice => voice.lang.includes('en'));
  
  if (englishVoice) {
    currentUtterance.voice = englishVoice;
  }

  speechSynthesis.speak(currentUtterance);
}

/**
 * Toggle speech preference
 */
export function toggleSpeechPreference() {
  const current = localStorage.getItem('speech-enabled') === 'true';
  localStorage.setItem('speech-enabled', (!current).toString());
  return !current;
}
