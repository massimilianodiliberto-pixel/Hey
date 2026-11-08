// La colonna: una spirale di vertebre astratte che è il tempo di Giangi.
// Ogni esperienza sta alla vertebra della sua epoca. Lo scroll muove la camera lungo la colonna;
// la colonna ruota con la posizione, quindi tornando indietro nel tempo si svita.
// Si disegna solo quando lo stato cambia: da fermo l'immagine resta immobile (BRIEF §5).

import * as THREE from "three";

export type SpineState = {
  u: number; // posizione lungo la colonna, in vertebre (0 = la prima, in alto)
  twist: number; // torsione aggiuntiva: si stringe durante i salti
  streak: number; // 0..1, scia di luce durante i salti
  orbit: number; // rotazione della camera attorno alla colonna (radianti)
  dist: number; // distanza della camera
  height: number; // quota della camera rispetto al punto guardato
  reveal: number; // 0..1, quanto la colonna è emersa dal buio
};

export type Spine = {
  set: (s: Partial<SpineState>) => void;
  resize: () => void;
  destroy: () => void;
};

const N = 64;
const STEP = 1.25; // distanza verticale tra due vertebre
const BASE_TWIST = 0.21;

// Centro della vertebra i lungo la spirale. Il raggio respira: la spirale si allarga e si stringe.
function centerline(i: number, twist: number, out = new THREE.Vector3()) {
  const a = i * twist;
  const r = 0.55 + 1.15 * (0.5 + 0.5 * Math.cos(i / 7.5));
  return out.set(Math.cos(a) * r, -i * STEP, Math.sin(a) * r);
}

export function createSpine(canvas: HTMLCanvasElement, opts: { mobile: boolean }): Spine {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.mobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d0c0b, 14, 46);
  const camera = new THREE.PerspectiveCamera(opts.mobile ? 44 : 30, 1, 0.1, 160);

  // Una sola luce chiave al tungsteno, un controluce freddo appena accennato.
  const key = new THREE.SpotLight(0xffe0b8, 420, 0, 0.75, 0.75, 1.5);
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x9fb2c6, 1.0);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  // Vertebra astratta: un corpo tornito, due ali sottili, una lama dorsale, un disco di luce.
  const stone = new THREE.MeshStandardMaterial({ color: 0xbdb5a6, roughness: 0.86, metalness: 0.0 });
  const glowMat = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.4, emissive: 0xf0b25e, emissiveIntensity: 0.35 });
  const profile = [
    [0.0, -0.42], [0.95, -0.42], [1.12, -0.32], [1.04, 0.0], [1.12, 0.32], [0.95, 0.42], [0.0, 0.42],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bodyGeo = new THREE.LatheGeometry(profile, opts.mobile ? 28 : 48);
  // Ali: lame sottili e affusolate, più architettura che anatomia.
  const finGeo = new THREE.CylinderGeometry(0.02, 0.16, 1.7, 10);
  finGeo.rotateZ(Math.PI / 2);
  finGeo.translate(1.05 + 0.85, 0, 0);
  const bladeGeo = new THREE.CylinderGeometry(0.02, 0.12, 1.3, 10);
  bladeGeo.rotateX(Math.PI / 2);
  bladeGeo.translate(0, 0, -1.6);
  const discGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.16, opts.mobile ? 24 : 40);

  const bodies = new THREE.InstancedMesh(bodyGeo, stone, N);
  const finsL = new THREE.InstancedMesh(finGeo, stone, N);
  const finsR = new THREE.InstancedMesh(finGeo, stone, N);
  const blades = new THREE.InstancedMesh(bladeGeo, stone, N);
  const discs = new THREE.InstancedMesh(discGeo, glowMat, N - 1);
  const group = new THREE.Group();
  group.add(bodies, finsL, finsR, blades, discs);
  scene.add(group);

  // La scia: un filo di luce lungo la spirale, acceso solo durante i salti.
  const trailMat = new THREE.MeshBasicMaterial({ color: 0xf0b25e, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  let trail: THREE.Mesh | null = null;

  const state: SpineState = { u: 0, twist: 0, streak: 0, orbit: -0.7, dist: 24, height: 3, reveal: 0 };
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const s1 = new THREE.Vector3(1, 1, 1);
  let lastTwist = NaN;

  function layout(twist: number) {
    for (let i = 0; i < N; i++) {
      centerline(i, twist, v);
      const a = i * twist;
      e.set(0, -a * 1.35, Math.cos(a) * 0.06);
      q.setFromEuler(e);
      m.compose(v, q, s1);
      bodies.setMatrixAt(i, m);
      blades.setMatrixAt(i, m);
      e.set(0, -a * 1.35 + 0.45, -0.12);
      finsL.setMatrixAt(i, m.compose(v, q.setFromEuler(e), s1));
      e.set(0, -a * 1.35 + Math.PI - 0.45, -0.12);
      finsR.setMatrixAt(i, m.compose(v, q.setFromEuler(e), s1));
      if (i < N - 1) {
        centerline(i + 0.5, twist, v);
        discs.setMatrixAt(i, m.compose(v, q.identity(), s1));
      }
    }
    for (const im of [bodies, finsL, finsR, blades, discs]) im.instanceMatrix.needsUpdate = true;
    const pts = Array.from({ length: N * 3 }, (_, k) => centerline(k / 3, twist).add(new THREE.Vector3(0, 0, 0)));
    trail?.geometry.dispose();
    if (trail) group.remove(trail);
    trail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 3, 0.06, 6), trailMat);
    group.add(trail);
    lastTwist = twist;
  }

  const target = new THREE.Vector3();
  let raf = 0;
  function render() {
    raf = 0;
    const twist = BASE_TWIST + state.twist;
    if (Math.abs(twist - lastTwist) > 1e-4) layout(twist);
    // La colonna ruota con la posizione: scendendo si avvita, risalendo si svita.
    group.rotation.y = state.u * 0.32;
    centerline(state.u, twist, target).applyAxisAngle(new THREE.Vector3(0, 1, 0), group.rotation.y);
    target.x *= 0.35;
    target.z *= 0.35; // la camera segue l'asse, non ogni oscillazione della spirale
    const d = state.dist;
    camera.position.set(target.x + Math.cos(state.orbit) * d, target.y + state.height, target.z + Math.sin(state.orbit) * d);
    camera.lookAt(target);
    key.position.set(camera.position.x + 9, camera.position.y + 14, camera.position.z + 4);
    key.target.position.copy(target);
    rim.position.set(target.x - 10, target.y + 6, target.z - 12);
    const fog = scene.fog as THREE.Fog;
    fog.near = state.dist - 6;
    fog.far = state.dist + 26;
    trailMat.opacity = state.streak * 0.85;
    glowMat.emissiveIntensity = 0.3 + state.streak * 0.9;
    stone.opacity = 1;
    canvas.style.opacity = String(state.reveal);
    renderer.render(scene, camera);
  }
  const request = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Su desktop la colonna sta nel terzo destro: il quadro del ricordo occupa la sinistra.
    if (opts.mobile) camera.clearViewOffset();
    else camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    camera.updateProjectionMatrix();
    request();
  }

  layout(BASE_TWIST);
  resize();
  window.addEventListener("resize", resize);

  return {
    set(s) {
      let changed = false;
      for (const k of Object.keys(s) as (keyof SpineState)[]) {
        const val = s[k] as number;
        if (Math.abs(state[k] - val) > 1e-4) {
          state[k] = val;
          changed = true;
        }
      }
      if (changed) request();
    },
    resize,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      [bodyGeo, finGeo, bladeGeo, discGeo].forEach((g) => g.dispose());
      trail?.geometry.dispose();
    },
  };
}

export const SPINE = { N, STEP };
