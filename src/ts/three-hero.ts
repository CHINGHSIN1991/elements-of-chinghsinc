import * as THREE from 'three';

type FadeState = 'idle' | 'fading-out' | 'fading-in';

interface SceneEntry {
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
}

export interface HeroSceneOptions {
  /** Element that receives ArrowLeft / ArrowRight to switch scenes. */
  keyboardRoot?: HTMLElement;
  /** Called after a scene change has fully settled. */
  onSceneChange?: (index: number) => void;
}

// Light / dark accent for the mesh, mirroring --color-primary in theme.css.
const MESH_COLOR_LIGHT = 0x2563eb;
const MESH_COLOR_DARK = 0x60a5fa;

export function initHeroScene(
  canvas: HTMLCanvasElement,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement,
  indicators: NodeListOf<Element>,
  options: HeroSceneOptions = {}
) {
  // ── Renderer ────────────────────────────────────────────────────────────
  // Transparent clear colour: the page background shows through, so the hero
  // never has a visible seam against the surrounding layout in either theme.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Motion preference ───────────────────────────────────────────────────
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;

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

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x6699ff, 0.4);
    fillLight.position.set(-5, -3, -5);
    scene.add(fillLight);

    const mat = new THREE.MeshStandardMaterial({
      color: MESH_COLOR_LIGHT,
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
  // On wide viewports the mesh sits to the right of the copy; on narrow ones
  // it stays centred behind the copy at reduced opacity so text stays legible.
  let maxOpacity = 1;
  let currentIndex = 0;
  let nextIndex = 0;
  let fadeState: FadeState = 'idle';
  let fadeProgress = 0;

  // ── Auto-rotation ────────────────────────────────────────────────────────
  let autoRotate = !reduceMotion;
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
      const active = i === currentIndex;
      dot.classList.toggle('active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    options.onSceneChange?.(currentIndex);
  }

  // ── Button / indicator / keyboard events ──────────────────────────────────
  const onPrevClick = () => goToScene(((currentIndex - 1) + 4) % 4);
  const onNextClick = () => goToScene((currentIndex + 1) % 4);
  prevBtn.addEventListener('click', onPrevClick);
  nextBtn.addEventListener('click', onNextClick);

  const indicatorHandlers: Array<[Element, () => void]> = [];
  indicators.forEach((dot, i) => {
    const handler = () => goToScene(i);
    dot.addEventListener('click', handler);
    indicatorHandlers.push([dot, handler]);
  });

  const keyboardRoot = options.keyboardRoot;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrevClick();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNextClick();
    }
  };
  keyboardRoot?.addEventListener('keydown', onKeyDown);

  // ── Pointer events ────────────────────────────────────────────────────────
  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    pointerStartX = lastPointerX = e.clientX;
    pointerStartY = lastPointerY = e.clientY;
    gestureType = 'unknown';
    pauseAutoRotate();
    canvas.setPointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerdown', onPointerDown);

  const onPointerMove = (e: PointerEvent) => {
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
  };
  canvas.addEventListener('pointermove', onPointerMove);

  const onPointerUp = (e: PointerEvent) => {
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
  };
  canvas.addEventListener('pointerup', onPointerUp);

  const onPointerCancel = () => {
    isDragging = false;
    gestureType = 'unknown';
    resumeAutoRotate();
  };
  canvas.addEventListener('pointercancel', onPointerCancel);

  // ── Auto-rotation control ──────────────────────────────────────────────────
  function pauseAutoRotate() {
    autoRotate = false;
    if (autoRotateTimer) clearTimeout(autoRotateTimer);
  }

  function resumeAutoRotate() {
    if (autoRotateTimer) clearTimeout(autoRotateTimer);
    if (reduceMotion) return;
    autoRotateTimer = setTimeout(() => {
      autoRotate = true;
    }, 2000);
  }

  const onMotionPrefChange = (e: MediaQueryListEvent) => {
    reduceMotion = e.matches;
    if (reduceMotion) pauseAutoRotate();
    else resumeAutoRotate();
  };
  motionQuery.addEventListener('change', onMotionPrefChange);

  // ── Dark mode ──────────────────────────────────────────────────────────────
  function updateBackground() {
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? MESH_COLOR_DARK : MESH_COLOR_LIGHT;
    entries.forEach(({ mat }) => mat.color.setHex(color));
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

    const wide = w >= 768 && camera.aspect > 1.1;
    maxOpacity = wide ? 1 : 0.4;
    // 0 at a 1.1 aspect (tablet landscape) → 1 from 1.6 (desktop) upwards, so
    // the mesh grows and moves right as there is room for it beside the copy.
    const t = Math.min(1, Math.max(0, (camera.aspect - 1.1) / 0.5));
    entries.forEach(({ mesh, mat }, i) => {
      mesh.position.x = wide ? 1.1 + 0.4 * t : 0;
      // Portrait viewports have a narrow horizontal FOV; shrink so the mesh
      // reads as a backdrop rather than filling the screen.
      mesh.scale.setScalar(wide ? 0.65 + 0.35 * t : 0.6);
      if (fadeState === 'idle' && i === currentIndex) mat.opacity = maxOpacity;
    });
  }

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(canvas);

  // ── Animation loop ─────────────────────────────────────────────────────────
  // Under reduced motion the cross-fade is near-instant instead of 400ms.
  const fadeSpeed = () => (reduceMotion ? 40 : 2.5);
  // THREE.Clock is deprecated; plain timestamps do the same job here.
  let lastFrameTime = performance.now();
  // rAF pauses on a hidden tab, so the first frame back can report a huge
  // delta and snap the fade to its end. Cap it at ~3 frames' worth.
  const MAX_DELTA = 0.05;
  let animFrameId = 0;
  let running = false;

  function animate() {
    if (!running) return;
    animFrameId = requestAnimationFrame(animate);
    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) / 1000, MAX_DELTA);
    lastFrameTime = now;

    if (fadeState === 'fading-out') {
      fadeProgress += delta * fadeSpeed();
      entries[currentIndex].mat.opacity = Math.max(0, 1 - fadeProgress) * maxOpacity;
      if (fadeProgress >= 1) {
        entries[currentIndex].mat.opacity = 0;
        currentIndex = nextIndex;
        entries[currentIndex].mat.opacity = 0;
        fadeState = 'fading-in';
        fadeProgress = 0;
        updateIndicators();
      }
    } else if (fadeState === 'fading-in') {
      fadeProgress += delta * fadeSpeed();
      entries[currentIndex].mat.opacity = Math.min(1, fadeProgress) * maxOpacity;
      if (fadeProgress >= 1) {
        entries[currentIndex].mat.opacity = maxOpacity;
        fadeState = 'idle';
      }
    }

    if (autoRotate && !isDragging) {
      entries[currentIndex].mesh.rotation.y += delta * 0.4;
      entries[currentIndex].mesh.rotation.x += delta * 0.1;
    }

    renderer.render(entries[currentIndex].scene, camera);
  }

  function startLoop() {
    if (running) return;
    running = true;
    lastFrameTime = performance.now();
    animFrameId = requestAnimationFrame(animate);
  }

  function stopLoop() {
    running = false;
    cancelAnimationFrame(animFrameId);
  }

  // Pause rendering while the hero is scrolled out of view (landing guidance:
  // pause hero media offscreen). One static frame is always drawn first so
  // the canvas is never blank when it scrolls back in.
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) startLoop();
      else stopLoop();
    },
    { threshold: 0 }
  );

  // ── Init ──────────────────────────────────────────────────────────────────
  handleResize();
  updateBackground();
  updateIndicators();
  renderer.render(entries[currentIndex].scene, camera);
  visibilityObserver.observe(canvas);

  return {
    goToScene,
    destroy() {
      stopLoop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionPrefChange);
      if (autoRotateTimer) clearTimeout(autoRotateTimer);
      prevBtn.removeEventListener('click', onPrevClick);
      nextBtn.removeEventListener('click', onNextClick);
      indicatorHandlers.forEach(([dot, handler]) => dot.removeEventListener('click', handler));
      keyboardRoot?.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      entries.forEach(({ scene, mesh, mat }) => {
        mesh.geometry.dispose();
        mat.dispose();
        scene.clear();
      });
      renderer.dispose();
    },
  };
}
