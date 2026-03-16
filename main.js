import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Object
const geometry = new THREE.TorusKnotGeometry(10, 3, 300, 20);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x6366f1,
  roughness: 0.2,
  metalness: 0.8,
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(10, 10, 10);

const pointLight2 = new THREE.PointLight(0xec4899, 500);
pointLight2.position.set(-10, -10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, pointLight2, ambientLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// Mouse tracking for particles
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.01;

  // Gently rotate particles
  particlesMesh.rotation.y = mouseY * 0.5 + elapsedTime * 0.05;
  particlesMesh.rotation.x = mouseX * 0.5 + elapsedTime * 0.05;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
