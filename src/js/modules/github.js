/**
 * GitHub API Module
 * Fetches repository data from GitHub API
 */

const GITHUB_USERNAME = 'mahavirbha';
const GITHUB_API_BASE = 'https://api.github.com';

// Cache for API responses
let reposCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch user's public repositories
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos() {
  // Check cache first
  if (reposCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return reposCache;
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    
    // Filter and transform repos
    const transformedRepos = repos
      .filter(repo => !repo.fork && !repo.private) // Only original, public repos
      .map(repo => transformRepoToProject(repo));

    // Update cache
    reposCache = transformedRepos;
    cacheTimestamp = Date.now();

    return transformedRepos;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

/**
 * Transform GitHub repo data to project format
 * @param {Object} repo - GitHub repository object
 * @returns {Object} Project object for portfolio
 */
function transformRepoToProject(repo) {
  return {
    id: `github-${repo.id}`,
    title: formatRepoName(repo.name),
    description: repo.description || 'A project by Mahavirsinh Chauhan',
    category: detectCategory(repo),
    tags: extractTags(repo),
    image: null, // Will use placeholder
    github: repo.html_url,
    demo: repo.homepage || null,
    featured: repo.stargazers_count > 0 || repo.name.toLowerCase().includes('portfolio'),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    updatedAt: repo.updated_at,
    isGitHub: true
  };
}

/**
 * Format repository name to readable title
 * @param {string} name - Repository name
 * @returns {string} Formatted title
 */
function formatRepoName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Detect project category based on repo data
 * @param {Object} repo - GitHub repository
 * @returns {string} Category name
 */
function detectCategory(repo) {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();
  const topics = repo.topics || [];

  // Check for specific patterns
  if (topics.includes('react-native') || name.includes('rn-') || name.includes('react-native')) {
    return 'mobile';
  }
  if (topics.includes('machine-learning') || topics.includes('ml') || 
      desc.includes('machine learning') || desc.includes('classifier') || 
      desc.includes('prediction') || name.includes('ml')) {
    return 'ml';
  }
  if (topics.includes('react') || topics.includes('nextjs') || 
      name.includes('react') || name.includes('next')) {
    return 'web';
  }
  if (lang === 'python' && (desc.includes('api') || desc.includes('backend'))) {
    return 'backend';
  }
  if (topics.includes('iot') || name.includes('iot') || name.includes('arduino')) {
    return 'iot';
  }
  if (lang === 'javascript' || lang === 'typescript' || lang === 'html') {
    return 'web';
  }
  if (lang === 'python') {
    return 'ml';
  }
  if (lang === 'java') {
    return 'backend';
  }

  return 'web'; // Default
}

/**
 * Extract tags from repository
 * @param {Object} repo - GitHub repository
 * @returns {Array<string>} Array of tags
 */
function extractTags(repo) {
  const tags = [];
  
  // Add language
  if (repo.language) {
    tags.push(repo.language);
  }

  // Add topics (GitHub repo topics)
  if (repo.topics && repo.topics.length > 0) {
    tags.push(...repo.topics.slice(0, 3)); // Max 3 topics
  }

  // Detect frameworks from name/description
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (name.includes('react') || desc.includes('react')) tags.push('React');
  if (name.includes('next') || desc.includes('next.js')) tags.push('Next.js');
  if (name.includes('expo')) tags.push('Expo');
  if (name.includes('three') || desc.includes('three.js')) tags.push('Three.js');
  if (name.includes('streamlit') || desc.includes('streamlit')) tags.push('Streamlit');

  // Remove duplicates and limit
  return [...new Set(tags)].slice(0, 5);
}

/**
 * Fetch repository languages breakdown
 * @param {string} repoName - Repository name
 * @returns {Promise<Object>} Language breakdown
 */
export async function fetchRepoLanguages(repoName) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    return {};
  }
}

/**
 * Get GitHub user stats
 * @returns {Promise<Object>} User statistics
 */
export async function fetchGitHubStats() {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`),
      fetchGitHubRepos()
    ]);

    const user = await userResponse.json();
    
    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars: reposResponse.reduce((acc, repo) => acc + (repo.stars || 0), 0),
      totalForks: reposResponse.reduce((acc, repo) => acc + (repo.forks || 0), 0),
      topLanguages: getTopLanguages(reposResponse)
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

/**
 * Get top languages from repos
 * @param {Array} repos - Array of repository objects
 * @returns {Array} Top languages
 */
function getTopLanguages(repos) {
  const langCount = {};
  repos.forEach(repo => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });

  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ language: lang, count }));
}
