/**
 * Contact Form Module
 * Handles form submission via WhatsApp
 */

/**
 * Initialize contact form
 */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;

  form.addEventListener('submit', handleSubmit);
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields');
    return;
  }

  // Format message for WhatsApp
  const whatsappMessage = encodeURIComponent(
    `${message}\n\n` +
    `From: ${name} (${email})`
  );

  // WhatsApp number
  const phoneNumber = '919687264433';

  // Open WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
  window.open(whatsappUrl, '_blank');

  // Reset form
  form.reset();

  // Show success feedback
  showSuccessMessage();
}

/**
 * Show success message
 */
function showSuccessMessage() {
  const submitBtn = document.querySelector('.contact_form-submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="bx bx-check"></i> Opening WhatsApp...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 3000);
}
