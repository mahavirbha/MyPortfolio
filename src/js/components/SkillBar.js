/**
 * SkillBar Component
 * Renders animated skill bars from JSON data
 */

import skillsData from '@data/skills.json';

/**
 * Initialize skills section
 */
export function initSkills() {
  renderSkillCategories();
}

/**
 * Render all skill categories
 */
function renderSkillCategories() {
  const container = document.querySelector('.skills_container');
  if (!container) return;

  container.innerHTML = skillsData.categories.map(category => 
    createSkillCategory(category)
  ).join('');
}

/**
 * Create skill category HTML
 */
function createSkillCategory(category) {
  return `
    <div class="skills_category">
      <h3 class="skills_category-title">
        <i class="bx ${category.icon}"></i>
        ${category.name}
      </h3>
      <div class="skills_list">
        ${category.skills.map(skill => createSkillBar(skill)).join('')}
      </div>
    </div>
  `;
}

/**
 * Create individual skill bar HTML
 */
function createSkillBar(skill) {
  return `
    <div class="skill_item">
      <div class="skill_header">
        <span class="skill_name">
          <i class="bx ${skill.icon}"></i>
          ${skill.name}
        </span>
        <span class="skill_percentage">${skill.level}%</span>
      </div>
      <div class="skill_bar">
        <div 
          class="skill_progress" 
          data-percentage="${skill.level}%"
          style="width: 0%"
        ></div>
      </div>
    </div>
  `;
}

/**
 * Animate skill bars (called by scroll effects)
 */
export function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill_progress');
  
  skillBars.forEach(bar => {
    const percentage = bar.dataset.percentage;
    bar.style.width = percentage;
  });
}

/**
 * Reset skill bars (for re-animation)
 */
export function resetSkillBars() {
  const skillBars = document.querySelectorAll('.skill_progress');
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
  });
}
