import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class CoolingApplianceScene {
    constructor() {
        this.container = document.getElementById('three-canvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Camera position
        this.camera.position.set(4, 2, 5);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x0ea5e9, 1.2);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const bluePointLight = new THREE.PointLight(0x06b6d4, 1, 10);
        bluePointLight.position.set(-2, 1, 2);
        this.scene.add(bluePointLight);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;

        // Build Stylized AC Model
        this.applianceGroup = new THREE.Group();
        this.createACModel();
        this.scene.add(this.applianceGroup);

        // Add Floating Particles (Ice/Cold Air)
        this.createParticles();

        // Start Animation
        this.animate();

        // Handle Resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createACModel() {
        // Main Body (Indoor Unit)
        const bodyGeo = new THREE.BoxGeometry(3.5, 1.2, 0.9);
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        this.applianceGroup.add(body);

        // Front Panel Bevel
        const panelGeo = new THREE.BoxGeometry(3.6, 1.0, 0.1);
        const panelMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.2 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.z = 0.45;
        this.applianceGroup.add(panel);

        // Vents
        const ventGeo = new THREE.BoxGeometry(3.2, 0.05, 0.05);
        const ventMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
        for (let i = 0; i < 4; i++) {
            const vent = new THREE.Mesh(ventGeo, ventMat);
            vent.position.set(0, -0.35 - (i * 0.1), 0.5);
            this.applianceGroup.add(vent);
        }

        // Digital Glow Display
        const displayGeo = new THREE.PlaneGeometry(0.5, 0.25);
        const displayMat = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.8
        });
        const display = new THREE.Mesh(displayGeo, displayMat);
        display.position.set(1.2, 0.2, 0.51);
        this.applianceGroup.add(display);

        // Add temperature text simulation
        const tempGeo = new THREE.PlaneGeometry(0.2, 0.15);
        const tempMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const temp = new THREE.Mesh(tempGeo, tempMat);
        temp.position.set(1.2, 0.2, 0.52);
        this.applianceGroup.add(temp);

        // Branding
        const logoGeo = new THREE.CircleGeometry(0.1, 32);
        const logoMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9, emissiveIntensity: 0.5 });
        const logo = new THREE.Mesh(logoGeo, logoMat);
        logo.position.set(-1.3, 0.3, 0.51);
        this.applianceGroup.add(logo);
    }

    createParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            velocities[i] = 0.01 + Math.random() * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleVelocities = velocities;

        const material = new THREE.PointsMaterial({
            size: 0.08,
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        if (this.applianceGroup) {
            this.applianceGroup.position.y = Math.sin(time) * 0.1;
            this.applianceGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
        }

        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3 + 1] -= this.particleVelocities[i];
                if (positions[i * 3 + 1] < -5) {
                    positions[i * 3 + 1] = 5;
                }
                positions[i * 3] += Math.sin(time + i) * 0.002;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate the scene
new CoolingApplianceScene();
