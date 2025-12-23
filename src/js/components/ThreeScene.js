/**
 * Three.js Scene Component
 * Interactive 3D geometry for hero section background
 */

import * as THREE from 'three';

let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let animationId = null;

/**
 * Initialize Three.js scene
 */
export function initThreeScene() {
  const container = document.getElementById('three-canvas');
  if (!container) return;

  // Scene setup
  scene = new THREE.Scene();
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = -1.25; // Move camera up to position 3D shape higher

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Create main geometry - Icosahedron
  createMainGeometry();

  // Create floating particles
  createFloatingParticles();

  // Lights
  addLights();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);

  // Start animation
  animate();

  // Theme change listener
  observeThemeChange();
}

/**
 * Create main rotating geometry
 */
function createMainGeometry() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const color = isDark ? 0xff6b4a : 0xcc4b2c;
  const opacity = isDark ? 0.8 : 0.25;

  // Icosahedron with wireframe
  geometry = new THREE.IcosahedronGeometry(1.5, 1);
  
  // Wireframe material
  material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: opacity,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Inner solid icosahedron (smaller, more transparent)
  const innerGeometry = new THREE.IcosahedronGeometry(1, 0);
  const innerMaterial = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  innerMesh.name = 'innerMesh';
  scene.add(innerMesh);
}

/**
 * Create floating particle system
 */
function createFloatingParticles() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const color = isDark ? 0xff6b4a : 0xcc4b2c;

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: color,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.name = 'particles';
  scene.add(particles);
}

/**
 * Add lights to scene
 */
function addLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Point light
  const pointLight = new THREE.PointLight(0xcc4b2c, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Secondary point light
  const pointLight2 = new THREE.PointLight(0x662616, 0.5, 100);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);
}

/**
 * Animation loop
 */
function animate() {
  animationId = requestAnimationFrame(animate);

  // Smooth mouse following
  targetX += (mouseX - targetX) * 0.02;
  targetY += (mouseY - targetY) * 0.02;

  // Rotate main mesh
  if (mesh) {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.005;
    mesh.rotation.x += targetY * 0.001;
    mesh.rotation.y += targetX * 0.001;
  }

  // Rotate inner mesh (opposite direction)
  const innerMesh = scene.getObjectByName('innerMesh');
  if (innerMesh) {
    innerMesh.rotation.x -= 0.002;
    innerMesh.rotation.y -= 0.003;
  }

  // Rotate particles
  const particles = scene.getObjectByName('particles');
  if (particles) {
    particles.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}

/**
 * Handle window resize
 */
function onWindowResize() {
  const container = document.getElementById('three-canvas');
  if (!container) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Handle mouse movement
 */
function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
}

/**
 * Observe theme changes and update colors
 */
function observeThemeChange() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        updateColors();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

/**
 * Update mesh colors on theme change
 */
function updateColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const color = isDark ? 0xff6b4a : 0xcc4b2c;

  if (material) {
    material.color.setHex(color);
  }

  const innerMesh = scene.getObjectByName('innerMesh');
  if (innerMesh) {
    innerMesh.material.color.setHex(color);
  }

  const particles = scene.getObjectByName('particles');
  if (particles) {
    particles.material.color.setHex(color);
  }
}

/**
 * Cleanup - call when component unmounts
 */
export function destroyThreeScene() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onMouseMove);

  if (renderer) {
    renderer.dispose();
    const container = document.getElementById('three-canvas');
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
  }

  if (geometry) geometry.dispose();
  if (material) material.dispose();
}
