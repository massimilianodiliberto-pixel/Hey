// La colonna: una scultura, non un'anatomia. Una spirale verticale di lame sottili in metallo
// brunito e dischi di luce, che è il tempo di Giangi.
// Ogni esperienza sta alla vertebra della sua epoca. Lo scroll muove la camera lungo la colonna;
// la colonna ruota con la posizione, quindi tornando indietro nel tempo si svita.
// Si disegna solo quando lo stato cambia: da fermo l'immagine resta immobile (BRIEF §5).

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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

const N = 120;
const STEP = 0.66; // distanza verticale tra due anelli
const BASE_TWIST = 0.11;

// Centro della vertebra i lungo la spirale. Il raggio respira: la spirale si allarga e si stringe.
function centerline(i: number, twist: number, out = new THREE.Vector3()) {
  const a = i * twist;
  const r = 0.45 + 1.0 * (0.5 + 0.5 * Math.cos(i / 14));
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
  const key = new THREE.SpotLight(0xffd29a, 520, 0, 0.7, 0.8, 1.5);
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x9fb2c6, 1.0);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  // Riflessi morbidi per il metallo: una stanza neutra, attenuata. La luce vera resta il tungsteno.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // Lama: una lastra lunga e sottile di grafite/metallo brunito. Ogni anello ha due lame opposte.
  const metal = new THREE.MeshStandardMaterial({ color: 0x5a534a, roughness: 0.3, metalness: 0.85, envMapIntensity: 0.55 });
  const glowMat = new THREE.MeshStandardMaterial({ color: 0x120d08, roughness: 0.3, emissive: 0xf0b25e, emissiveIntensity: 0.55 });
  const bladeGeo = new THREE.BoxGeometry(3.4, 0.11, 0.55);
  bladeGeo.translate(0.25, 0, 0);
  const discGeo = new THREE.TorusGeometry(0.62, 0.025, 8, opts.mobile ? 40 : 72);
  discGeo.rotateX(Math.PI / 2);
  const coreGeo = new THREE.CylinderGeometry(0.035, 0.035, STEP, 8);

  const bladesA = new THREE.InstancedMesh(bladeGeo, metal, N);
  const bladesB = new THREE.InstancedMesh(bladeGeo, metal, N);
  const discs = new THREE.InstancedMesh(discGeo, glowMat, Math.ceil(N / 4));
  const cores = new THREE.InstancedMesh(coreGeo, metal, N - 1);
  const group = new THREE.Group();
  group.add(bladesA, bladesB, discs, cores);
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

  const up = new THREE.Vector3(0, 1, 0);
  const w = new THREE.Vector3();
  function layout(twist: number) {
    for (let i = 0; i < N; i++) {
      centerline(i, twist, v);
      const a = i * twist * 1.6;
      e.set(0, -a, 0);
      q.setFromEuler(e);
      bladesA.setMatrixAt(i, m.compose(v, q, s1));
      e.set(0, -a + Math.PI, 0);
      bladesB.setMatrixAt(i, m.compose(v, q.setFromEuler(e), s1));
      if (i % 4 === 0) discs.setMatrixAt(i / 4, m.compose(v, q.identity(), s1));
      if (i < N - 1) {
        // Un filo di metallo collega gli anelli lungo la spirale.
        centerline(i + 1, twist, w);
        const mid = v.clone().add(w).multiplyScalar(0.5);
        const dirv = w.clone().sub(v);
        const len = dirv.length();
        q.setFromUnitVectors(up, dirv.normalize());
        cores.setMatrixAt(i, m.compose(mid, q, new THREE.Vector3(1, len / STEP, 1)));
      }
    }
    for (const im of [bladesA, bladesB, discs, cores]) im.instanceMatrix.needsUpdate = true;
    const pts = Array.from({ length: N * 3 }, (_, k) => centerline(k / 3, twist));
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
    group.rotation.y = state.u * 0.16;
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
    glowMat.emissiveIntensity = 0.55 + state.streak * 1.2;
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
      [bladeGeo, discGeo, coreGeo].forEach((g) => g.dispose());
      pmrem.dispose();
      trail?.geometry.dispose();
    },
  };
}

export const SPINE = { N, STEP };
