/**
 * ProjectCard Component
 * Renders projects from JSON with filtering and modal support
 * Now with GitHub API integration
 */

import projectsData from '@data/projects.json';
import { fetchGitHubRepos } from '../modules/github.js';

let currentFilter = 'all';
let allProjects = [];
let githubRepos = [];

/**
 * Initialize projects section
 */
export async function initProjects() {
  // Load local projects first
  allProjects = [...(projectsData?.projects || [])];
  
  renderFilterButtons();
  renderProjects();
  initFilterListeners();
  initModalListeners();
  
  // Then fetch GitHub repos and merge
  await loadGitHubProjects();
}

/**
 * Render filter buttons
 */
function renderFilterButtons() {
  const filterContainer = document.querySelector('.projects_filter');
  if (!filterContainer) return;

  filterContainer.innerHTML = projectsData.categories.map(category => `
    <button 
      class="filter_btn ${category.id === 'all' ? 'active' : ''}" 
      data-filter="${category.id}"
    >
      <i class="bx ${category.icon}"></i>
      <span>${category.name}</span>
    </button>
  `).join('');
}

/**
 * Render project cards
 */
export function renderProjects(filter = 'all') {
  const container = document.querySelector('.projects_container');
  if (!container) return;

  const projectsToRender = filter === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === filter);

  container.innerHTML = projectsToRender.map(project => 
    project.isGitHub ? createGitHubProjectCard(project) : createProjectCard(project)
  ).join('');

  // Lazy load videos
  initLazyLoadVideos();
}

/**
 * Load and merge GitHub projects
 */
async function loadGitHubProjects() {
  try {
    githubRepos = await fetchGitHubRepos();
    
    // Filter out repos that already exist in local projects
    const localGithubUrls = allProjects
      .filter(p => p.github)
      .map(p => p.github.toLowerCase());
    
    const newGitHubProjects = githubRepos.filter(repo => 
      !localGithubUrls.includes(repo.github.toLowerCase())
    );

    // Add GitHub projects to all projects
    allProjects = [...projectsData.projects, ...newGitHubProjects];
    
    // Re-render if on 'all' filter
    if (currentFilter === 'all') {
      renderProjects('all');
    }
    
    // Add GitHub filter if not exists
    addGitHubFilter();
  } catch (error) {
    console.error('Failed to load GitHub projects:', error);
  }
}

/**
 * Add GitHub filter button
 */
function addGitHubFilter() {
  const filterContainer = document.querySelector('.projects_filter');
  if (!filterContainer) return;
  
  // Check if github filter already exists
  if (filterContainer.querySelector('[data-filter="github"]')) return;
  
  const githubBtn = document.createElement('button');
  githubBtn.className = 'filter_btn';
  githubBtn.dataset.filter = 'github';
  githubBtn.innerHTML = `
    <i class="bx bxl-github"></i>
    <span>GitHub</span>
  `;
  
  filterContainer.appendChild(githubBtn);
  
  // Add click listener
  githubBtn.addEventListener('click', () => {
    document.querySelectorAll('.filter_btn').forEach(b => b.classList.remove('active'));
    githubBtn.classList.add('active');
    filterProjects('github');
  });
}

/**
 * Create individual project card HTML
 */
function createProjectCard(project) {
  const isVideo = project.type === 'video';
  const mediaPath = isVideo 
    ? `./assets/videos/${project.media}` 
    : `./assets/images/projects/${project.media}`;

  return `
    <article class="project_card" data-project-id="${project.id}">
      <div class="project_media">
        ${isVideo ? `
          <video 
            data-src="${mediaPath}" 
            muted 
            loop 
            playsinline
            poster=""
          >
            <source data-src="${mediaPath}" type="video/mp4">
          </video>
          <div class="video_badge">
            <i class="bx bx-play-circle"></i>
            <span>Video</span>
          </div>
        ` : `
          <img 
            src="${mediaPath}" 
            alt="${project.title}"
            loading="lazy"
          >
        `}
        <div class="project_overlay">
          <div class="project_actions">
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener" class="project_action-btn" title="View Code">
                <i class="bx bxl-github"></i>
              </a>
            ` : ''}
            ${project.live ? `
              <a href="${project.live}" target="_blank" rel="noopener" class="project_action-btn" title="Live Demo">
                <i class="bx bx-link-external"></i>
              </a>
            ` : ''}
            <button class="project_action-btn" data-modal="${project.id}" title="View Details">
              <i class="bx bx-expand-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="project_content">
        <h3 class="project_title">${project.title}</h3>
        <span class="project_subtitle">${project.subtitle}</span>
        <p class="project_description">${project.description}</p>
        <div class="project_tags">
          ${project.tags.map(tag => `
            <span class="project_tag">${tag}</span>
          `).join('')}
        </div>
      </div>
    </article>
  `;
}

/**
 * Create GitHub project card HTML
 */
function createGitHubProjectCard(project) {
  const placeholderBg = getLanguageColor(project.language);
  
  return `
    <article class="project_card project_card--github" data-project-id="${project.id}">
      <div class="project_media">
        <div class="project_placeholder" style="background: ${placeholderBg}">
          <i class="bx bxl-github"></i>
          ${project.language ? `<span class="project_language">${project.language}</span>` : ''}
        </div>
        <div class="project_overlay">
          <div class="project_actions">
            <a href="${project.github}" target="_blank" rel="noopener" class="project_action-btn" title="View Code">
              <i class="bx bxl-github"></i>
            </a>
            ${project.demo ? `
              <a href="${project.demo}" target="_blank" rel="noopener" class="project_action-btn" title="Live Demo">
                <i class="bx bx-link-external"></i>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="project_content">
        <h3 class="project_title">${project.title}</h3>
        <div class="project_github-stats">
          ${project.stars > 0 ? `
            <span class="project_stat">
              <i class="bx bx-star"></i> ${project.stars}
            </span>
          ` : ''}
          ${project.forks > 0 ? `
            <span class="project_stat">
              <i class="bx bx-git-repo-forked"></i> ${project.forks}
            </span>
          ` : ''}
        </div>
        <p class="project_description">${project.description}</p>
        <div class="project_tags">
          ${project.tags?.map(tag => `
            <span class="project_tag">${tag}</span>
          `).join('')}
        </div>
      </div>
    </article>
  `;
}

/**
 * Get color based on programming language
 */
function getLanguageColor(language) {
  const colors = {
    'JavaScript': 'linear-gradient(135deg, #f7df1e 0%, #e8d21d 100%)',
    'TypeScript': 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
    'Python': 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)',
    'Java': 'linear-gradient(135deg, #ed8b00 0%, #5382a1 100%)',
    'HTML': 'linear-gradient(135deg, #e34c26 0%, #f06529 100%)',
    'CSS': 'linear-gradient(135deg, #264de4 0%, #2965f1 100%)',
    'C++': 'linear-gradient(135deg, #00599C 0%, #004482 100%)',
    'C#': 'linear-gradient(135deg, #239120 0%, #1e7a1e 100%)',
    'Jupyter Notebook': 'linear-gradient(135deg, #f37626 0%, #da5b0b 100%)',
    'default': 'linear-gradient(135deg, var(--first-color) 0%, var(--first-color-alt) 100%)'
  };
  
  return colors[language] || colors['default'];
}

/**
 * Initialize filter button listeners
 */
function initFilterListeners() {
  const filterButtons = document.querySelectorAll('.filter_btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter projects with animation
      filterProjects(filter);
    });
  });
}

/**
 * Filter projects with animation
 */
function filterProjects(filter) {
  currentFilter = filter;
  const container = document.querySelector('.projects_container');
  
  // Fade out
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    // Handle github filter specially
    if (filter === 'github') {
      const githubProjects = allProjects.filter(p => p.isGitHub);
      container.innerHTML = githubProjects.map(project => 
        createGitHubProjectCard(project)
      ).join('');
    } else {
      renderProjects(filter);
    }
    
    // Fade in
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 300);
}

/**
 * Initialize lazy loading for videos
 */
function initLazyLoadVideos() {
  const videos = document.querySelectorAll('.project_card video');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector('source');
        
        if (source && source.dataset.src) {
          video.src = source.dataset.src;
          source.src = source.dataset.src;
          video.load();
        }
        
        observer.unobserve(video);
      }
    });
  }, { rootMargin: '50px' });

  videos.forEach(video => observer.observe(video));

  // Play video on hover
  document.querySelectorAll('.project_card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// Modal state management
const modalState = {
  isOpen: false,
  element: null,
  contentElement: null,
  boundCloseHandler: null,
  boundKeyHandler: null
};

/**
 * Initialize modal listeners - only for opening
 */
function initModalListeners() {
  // Open modal on click
  document.addEventListener('click', (e) => {
    const modalBtn = e.target.closest('[data-modal]');
    if (modalBtn) {
      e.preventDefault();
      const projectId = modalBtn.dataset.modal;
      openModal(projectId);
    }
  });
}

/**
 * Open project modal
 */
function openModal(projectId) {
  const project = projectsData.projects.find(p => p.id === projectId);
  if (!project) return;

  // Create modal if doesn't exist
  if (!modalState.element) {
    createModal();
  }

  const isVideo = project.type === 'video';
  const mediaPath = isVideo 
    ? `./assets/videos/${project.media}` 
    : `./assets/images/projects/${project.media}`;

  modalState.contentElement.innerHTML = `
    <button class="modal_close" type="button" aria-label="Close modal">
      <i class="bx bx-x"></i>
    </button>
    <div class="modal_media">
      ${isVideo ? `
        <video controls autoplay>
          <source src="${mediaPath}" type="video/mp4">
        </video>
      ` : `
        <img src="${mediaPath}" alt="${project.title}">
      `}
    </div>
    <div class="modal_body">
      <h2 class="modal_title">${project.title}</h2>
      <span class="modal_subtitle">${project.subtitle}</span>
      <p class="modal_description">${project.description}</p>
      <div class="modal_tags">
        ${project.tags.map(tag => `<span class="project_tag">${tag}</span>`).join('')}
      </div>
      <div class="modal_actions">
        ${project.github ? `
          <a href="${project.github}" target="_blank" class="button">
            <i class="bx bxl-github"></i> View Code
          </a>
        ` : ''}
        ${project.live ? `
          <a href="${project.live}" target="_blank" class="button button--outline">
            <i class="bx bx-link-external"></i> Live Demo
          </a>
        ` : ''}
      </div>
    </div>
  `;

  // Bind close handlers
  bindCloseHandlers();

  // Show modal
  modalState.element.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalState.isOpen = true;
}

/**
 * Bind all close handlers
 */
function bindCloseHandlers() {
  // Close button click
  const closeBtn = modalState.contentElement.querySelector('.modal_close');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    };
  }

  // Click on backdrop (modal overlay)
  modalState.boundCloseHandler = (e) => {
    if (e.target === modalState.element) {
      closeModal();
    }
  };
  modalState.element.addEventListener('click', modalState.boundCloseHandler);

  // Escape key
  modalState.boundKeyHandler = (e) => {
    if (e.key === 'Escape' && modalState.isOpen) {
      closeModal();
    }
  };
  document.addEventListener('keydown', modalState.boundKeyHandler);
}

/**
 * Unbind close handlers
 */
function unbindCloseHandlers() {
  if (modalState.boundCloseHandler && modalState.element) {
    modalState.element.removeEventListener('click', modalState.boundCloseHandler);
  }
  if (modalState.boundKeyHandler) {
    document.removeEventListener('keydown', modalState.boundKeyHandler);
  }
  modalState.boundCloseHandler = null;
  modalState.boundKeyHandler = null;
}

/**
 * Close project modal
 */
function closeModal() {
  if (!modalState.element || !modalState.isOpen) return;

  // Stop any playing videos
  const video = modalState.element.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  // Hide modal
  modalState.element.classList.remove('active');
  document.body.style.overflow = '';
  modalState.isOpen = false;

  // Unbind handlers
  unbindCloseHandlers();

  // Clear content after animation
  setTimeout(() => {
    if (modalState.contentElement) {
      modalState.contentElement.innerHTML = '';
    }
  }, 300);
}

/**
 * Create modal container
 */
function createModal() {
  const modal = document.createElement('div');
  modal.className = 'project_modal';
  modal.innerHTML = '<div class="modal_content"></div>';
  document.body.appendChild(modal);
  
  modalState.element = modal;
  modalState.contentElement = modal.querySelector('.modal_content');
}
