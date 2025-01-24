import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import gsap from 'gsap'; // Import GSAP for animations

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Orthographic Camera
const aspect = window.innerWidth / window.innerHeight;
const cameraSize = 3; // Size of the visible area (adjust as needed)
const camera = new THREE.OrthographicCamera(
  -cameraSize * aspect, // Left
  cameraSize * aspect, // Right
  cameraSize, // Top
  -cameraSize, // Bottom
  0.1, // Near plane
  100 // Far plane
);
const originalPosition = new THREE.Vector3(1, -1, 2); // Original camera position
const originalTarget = new THREE.Vector3(0, 0, 0); // Original look-at target

camera.position.copy(originalPosition);
camera.lookAt(originalTarget);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define a Circle Shape (Solid Coin)
const shape = new THREE.Shape();
shape.absarc(0, 0, 1.5, 0, Math.PI * 2, false); // Outer circle (radius 1.5)

// Extrude Settings
const extrudeSettings = {
  depth: 1, // Thickness of the coin
  bevelEnabled: true, // Enable bevel for smooth edges
  bevelThickness: 0.05, // Thickness of the bevel
  bevelSize: 0.05, // Size of the bevel
  bevelSegments: 5, // Smoothness of the bevel
};

// Create Extruded Geometry
const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

// Material for Faces (Black)
const faceMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Material for Edges (White)
const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Combine Face and Edge Materials
const mesh = new THREE.Mesh(geometry, [edgeMaterial, faceMaterial]);
scene.add(mesh);

// Add Light for Better Visibility
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Add White Outline Around Edges
const outlineGeometry = new THREE.EdgesGeometry(geometry);
const outlineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 2,
});
const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
scene.add(outline);

// OrbitControls for Mouse Interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth damping for interactions
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.8; // Adjust rotation speed
controls.enableZoom = true; // Enable zoom with scroll
controls.enablePan = true; // Allow panning to test the bounce-back

// Reset Camera to Original Position with Spring Effect
function resetCameraWithSpring() {
  gsap.to(camera.position, {
    x: originalPosition.x,
    y: originalPosition.y,
    z: originalPosition.z,
    duration: 1, // Total animation duration
    ease: 'elastic.out(1, 0.5)', // Elastic ease (spring effect)
    onUpdate: () => camera.lookAt(originalTarget), // Ensure the camera keeps looking at the target
  });
}

// Mouse Interaction Flags
let mouseDown = false;

// Listen for Mouse Events to Track When Mouse is Released
window.addEventListener('mousedown', () => {
  mouseDown = true;
});

window.addEventListener('mouseup', () => {
  if (mouseDown) {
    resetCameraWithSpring();
  }
  mouseDown = false;
});

// Resize Event Listener for Responsive Canvas
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -cameraSize * aspect;
  camera.right = cameraSize * aspect;
  camera.top = cameraSize;
  camera.bottom = -cameraSize;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls on each frame
  renderer.render(scene, camera);
}
animate();
