// Import Three.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);


// Create the scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 5; // Move the camera away from the origin

// Initialize the WebGL renderer and add it to the document
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add an AxesHelper to visualize the X (red), Y (green), and Z (blue) axes
const axesHelper = new THREE.AxesHelper(5); // Length of each axis line
scene.add(axesHelper);

// Handle window resizing
window.addEventListener('resize', () => {
  // Update camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);


// Animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
