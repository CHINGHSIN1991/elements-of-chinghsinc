import * as THREE from 'three';

type FadeState = 'idle' | 'fading-out' | 'fading-in';

interface SceneEntry {
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
}

export function initHeroScene(
  canvas: HTMLCanvasElement,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement,
  indicators: NodeListOf<Element>
) {
  // ── Renderer ────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Camera ──────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 4);

  // ── Scenes ──────────────────────────────────────────────────────────────
  const geometries: THREE.BufferGeometry[] = [
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.CylinderGeometry(0.8, 0.8, 2, 64),
    new THREE.ConeGeometry(1, 2, 64),
  ];

  const entries: SceneEntry[] = geometries.map((geo, i) => {
    const scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x6699ff, 0.4);
    fillLight.position.set(-5, -3, -5);
    scene.add(fillLight);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0.2,
      roughness: 0.4,
      transparent: true,
      opacity: i === 0 ? 1 : 0,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    return { scene, mesh, mat };
  });

  // ── State ────────────────────────────────────────────────────────────────
  let currentIndex = 0;
  let nextIndex = 0;
  let fadeState: FadeState = 'idle';
  let fadeProgress = 0;

  // ── Auto-rotation ────────────────────────────────────────────────────────
  let autoRotate = true;
  let autoRotateTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Drag / gesture state ─────────────────────────────────────────────────
  let isDragging = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  type GestureType = 'unknown' | 'rotate' | 'swipe';
  let gestureType: GestureType = 'unknown';

  // ── Scene navigation ─────────────────────────────────────────────────────
  function goToScene(idx: number) {
    const clamped = ((idx % 4) + 4) % 4;
    if (clamped === currentIndex || fadeState !== 'idle') return;
    nextIndex = clamped;
    fadeState = 'fading-out';
    fadeProgress = 0;
  }

  function updateIndicators() {
    indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // ── Button events ─────────────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => goToScene(((currentIndex - 1) + 4) % 4));
  nextBtn.addEventListener('click', () => goToScene((currentIndex + 1) % 4));

  // ── Pointer events ────────────────────────────────────────────────────────
  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    pointerStartX = lastPointerX = e.clientX;
    pointerStartY = lastPointerY = e.clientY;
    gestureType = 'unknown';
    pauseAutoRotate();
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;

    if (gestureType === 'unknown' && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      if (e.pointerType === 'touch' && Math.abs(dx) > Math.abs(dy)) {
        gestureType = 'swipe';
      } else {
        gestureType = 'rotate';
      }
    }

    if (gestureType === 'rotate') {
      const dxMove = e.clientX - lastPointerX;
      const dyMove = e.clientY - lastPointerY;
      const mesh = entries[currentIndex].mesh;
      mesh.rotation.y += dxMove * 0.005;
      mesh.rotation.x += dyMove * 0.005;
    }

    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!isDragging) return;

    if (gestureType === 'swipe') {
      const dx = e.clientX - pointerStartX;
      if (Math.abs(dx) > 50) {
        goToScene(dx < 0 ? (currentIndex + 1) % 4 : ((currentIndex - 1) + 4) % 4);
      }
    }

    isDragging = false;
    gestureType = 'unknown';
    resumeAutoRotate();
  });

  canvas.addEventListener('pointercancel', () => {
    isDragging = false;
    gestureType = 'unknown';
    resumeAutoRotate();
  });

  // ── Auto-rotation control ──────────────────────────────────────────────────
  function pauseAutoRotate() {
    autoRotate = false;
    if (autoRotateTimer) clearTimeout(autoRotateTimer);
  }

  function resumeAutoRotate() {
    if (autoRotateTimer) clearTimeout(autoRotateTimer);
    autoRotateTimer = setTimeout(() => {
      autoRotate = true;
    }, 2000);
  }

  // ── Dark mode ──────────────────────────────────────────────────────────────
  function updateBackground() {
    const isDark = document.documentElement.classList.contains('dark');
    renderer.setClearColor(isDark ? 0x0f172a : 0xf3f4f6);
  }

  const themeObserver = new MutationObserver(updateBackground);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // ── Resize ────────────────────────────────────────────────────────────────
  function handleResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(canvas);

  // ── Animation loop ─────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  const FADE_SPEED = 2.5;
  let animFrameId: number;

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (fadeState === 'fading-out') {
      fadeProgress += delta * FADE_SPEED;
      entries[currentIndex].mat.opacity = Math.max(0, 1 - fadeProgress);
      if (fadeProgress >= 1) {
        entries[currentIndex].mat.opacity = 0;
        currentIndex = nextIndex;
        entries[currentIndex].mat.opacity = 0;
        fadeState = 'fading-in';
        fadeProgress = 0;
        updateIndicators();
      }
    } else if (fadeState === 'fading-in') {
      fadeProgress += delta * FADE_SPEED;
      entries[currentIndex].mat.opacity = Math.min(1, fadeProgress);
      if (fadeProgress >= 1) {
        entries[currentIndex].mat.opacity = 1;
        fadeState = 'idle';
      }
    }

    if (autoRotate && !isDragging) {
      entries[currentIndex].mesh.rotation.y += delta * 0.4;
      entries[currentIndex].mesh.rotation.x += delta * 0.1;
    }

    renderer.render(entries[currentIndex].scene, camera);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  handleResize();
  updateBackground();
  updateIndicators();
  animate();

  return {
    destroy() {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      if (autoRotateTimer) clearTimeout(autoRotateTimer);
      entries.forEach(({ scene, mesh, mat }) => {
        mesh.geometry.dispose();
        mat.dispose();
        scene.clear();
      });
      renderer.dispose();
    },
  };
}
