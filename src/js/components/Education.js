/**
 * Education Component
 * Renders education timeline from JSON data
 */

import educationData from '@data/education.json';

/**
 * Initialize education section
 */
export function initEducation() {
  renderEducationTimeline();
}

/**
 * Render education timeline
 */
function renderEducationTimeline() {
  const container = document.querySelector('.education_timeline');
  if (!container) return;

  container.innerHTML = educationData.timeline.map(item => 
    createEducationItem(item)
  ).join('');
}

/**
 * Create education item HTML
 */
function createEducationItem(item) {
  return `
    <div class="education_item">
      <div class="education_card">
        <span class="education_period">${item.period}</span>
        <h3 class="education_title">${item.level}</h3>
        <p class="education_institution">
          <i class="bx bx-buildings"></i>
          ${item.institution}
        </p>
        <div class="education_info">
          <span>${item.board}</span>
          <span class="education_result">${item.result}</span>
        </div>
      </div>
    </div>
  `;
}
