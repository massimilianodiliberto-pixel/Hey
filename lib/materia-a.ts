// MATERIA VIVA — sistema particellare.
// Le particelle vivono sulla GPU: ogni particella conosce le sette forme della materia e le attraversa
// in base alla fase (0..6) che arriva dallo scroll. Ognuna ha un ritardo proprio, così la
// trasformazione è organica e mai a blocchi. Lo sfondo è uno shader che muta insieme alla materia.

import * as THREE from "three";

export type Materia = {
  setPhase: (p: number) => void; // 0..6, continua
  // Grandi nomi delle esperienze, fatti di particelle: quale (−1 = nessuno), quanto è formato (0..1), rotazione.
  setName: (index: number, form: number, rot: number) => void;
  destroy: () => void;
};

// Le sette fasi: colore della materia e del mondo intorno.
// [materia caldo, materia luce, cielo alto, orizzonte, terra]
const PAL: [number, number, number, number, number][] = [
  [0x8a5a2b, 0xf0b25e, 0x050404, 0x070605, 0x050404], // 01 nascita: nero assoluto
  [0xb8692a, 0xffc27a, 0x0d0805, 0x2a1709, 0x0b0705], // 02 ricordo: ambra e rame
  [0xc23a1c, 0xffd2a0, 0x120505, 0x3a0d08, 0x0a0404], // 03 salto: rosso contrastato
  [0xd49a3c, 0xbfe6ee, 0x061417, 0x0f3236, 0x050c0d], // 04 espansione: blu petrolio e oro
  [0xb9b4aa, 0xffffff, 0x16181a, 0x4a4d50, 0x101112], // 05 composizione: grigio, argento
  [0xe0703a, 0xffd9a8, 0x2a1630, 0xe88a4a, 0x1a0f12], // 06 sintesi: tramonto caldo
  [0x4a3a2a, 0x8a6a44, 0xb9b6b0, 0xf2eee6, 0x8f8a82], // 07 continua: luce quasi bianca, granuli scuri controluce
];

const NOISE = /* glsl */ `
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)), dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)), dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)), dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)), dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }
  vec3 flow(vec3 p) { // campo di turbolenza morbido
    return vec3(noise(p), noise(p + vec3(31.4, 7.1, 2.7)), noise(p + vec3(-5.2, 19.3, 11.8)));
  }
`;

const PARTICLE_VERT = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uPhase;
  uniform float uTime;
  uniform float uSize;
  uniform float uFocus;
  uniform float uAperture;
  uniform vec3 uColA0; uniform vec3 uColA1; uniform vec3 uColB0; uniform vec3 uColB1;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPebble;
  ${NOISE}
  #define PI 3.14159265

  vec3 sphereDir(vec4 s) {
    float t = s.x * 2.0 * PI; float z = s.y * 2.0 - 1.0; float r = sqrt(1.0 - z * z);
    return vec3(r * cos(t), z, r * sin(t));
  }
  // Onda: la superficie fluida delle fasi 4 e 7. La materia si addensa sulle creste.
  float wave(float x, float z, float k) {
    return sin(x * 0.42 + z * 0.55) * 1.5 + sin(x * 0.95 - z * 0.3) * 0.55 * k;
  }

  // Le sette forme. a = visibilità della particella in quella forma.
  vec3 shape(int k, vec4 s, out float a) {
    a = 1.0;
    vec3 d = sphereDir(s);
    if (k == 0) { // nascita: pochi granuli isolati nel buio
      a = step(s.w, 0.06);
      return d * (3.0 + s.z * 9.0);
    }
    if (k == 1) { // ricordo: massa compatta che respira
      float r = 2.4 * pow(s.z, 0.33);
      r *= 1.0 + 0.32 * noise(d * 1.8 + 3.0);
      return d * r + vec3(0.0, 0.2, 0.0);
    }
    if (k == 2) { // salto: dispersione veloce, stirata nella direzione del moto
      vec3 p = d * (3.0 + s.z * 11.0);
      p.x = p.x * 2.4 + (s.w - 0.5) * 10.0;
      p.y *= 0.7;
      return p;
    }
    if (k == 3) { // espansione: la materia diventa fluida, un'onda larga
      float x = (s.x - 0.5) * 26.0; float z = (s.y - 0.5) * 9.0;
      float th = (s.z - 0.5) * (0.12 + 0.9 * pow(s.w, 3.0));
      return vec3(x, wave(x, z, 1.0) + th, z);
    }
    if (k == 4) { // composizione: livelli sovrapposti, come strati di un'immagine
      float layer = floor(s.z * 4.0);
      float x = (s.x - 0.5) * 18.0; float z = (s.y - 0.5) * 6.0;
      float y = (layer - 1.5) * 1.9 + sin(x * 0.35 + layer) * 0.35 + (s.w - 0.5) * 0.12;
      return vec3(x, y, z - layer * 0.6);
    }
    if (k == 5) { // sintesi: una forma nuova, ordinata, un nastro che si avvolge su se stesso
      float t = s.x * 2.0 * PI; float u = (s.y - 0.5) * 1.6;
      float R = 4.2 + 0.6 * sin(3.0 * t);
      vec3 c = vec3(cos(t) * R, sin(2.0 * t) * 1.1, sin(t) * R);
      vec3 n = normalize(vec3(cos(t), 0.0, sin(t)));
      vec3 b = vec3(0.0, 1.0, 0.0);
      float tw = t * 1.5;
      return c + (n * cos(tw) + b * sin(tw)) * u + d * 0.05 * s.w;
    }
    // continua: la forma si libera, rarefatta, oltre i bordi
    float x = (s.x - 0.5) * 70.0; float z = (s.y - 0.5) * 20.0;
    a = 0.35 + 0.65 * step(s.w, 0.35);
    return vec3(x, wave(x * 0.6, z, 0.6) * 1.2 - 1.0 + (s.z - 0.5) * 2.5, z);
  }

  void main() {
    float p = clamp(uPhase, 0.0, 6.0);
    int k = int(min(floor(p), 5.0));
    float f = p - float(k);
    // Ogni particella parte con un ritardo proprio: la trasformazione è un'onda, non uno stacco.
    float ff = smoothstep(0.0, 1.0, clamp((f - aSeed.w * 0.38) / 0.62, 0.0, 1.0));
    float a0; float a1;
    vec3 p0 = shape(k, aSeed, a0);
    vec3 p1 = shape(k + 1, aSeed, a1);
    vec3 pos = mix(p0, p1, ff);
    // Turbolenza: forte durante i passaggi, quasi ferma nelle forme compiute; il salto è il più violento.
    float trans = sin(ff * PI);
    float turb = 0.18 + trans * (k == 1 || k == 2 ? 2.6 : 1.1);
    pos += flow(pos * 0.28 + vec3(uTime * 0.05, 0.0, uTime * 0.03) + aSeed.xyz * 0.4) * turb;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float depth = -mv.z;
    // Profondità di campo: fuori fuoco la particella si allarga e si attenua.
    float coc = abs(depth - uFocus) * uAperture;
    // Nella nascita i pochi granuli sono più grandi e più luminosi: devono vedersi nel buio.
    float born = k == 0 ? mix(2.4, 1.0, ff) : 1.0;
    // Un granulo su trenta è un sasso: più grande, sferico, illuminato. Dà corpo alla materia.
    vPebble = step(fract(aSeed.w * 37.0), 0.006);
    float pebble = 1.0 + vPebble * (1.8 + aSeed.z * 3.5);
    gl_PointSize = (uSize * (0.45 + aSeed.z * 1.1) * born * pebble + coc * (5.0 + vPebble * 12.0)) * (26.0 / depth);
    gl_Position = projectionMatrix * mv;

    vec3 c0 = mix(uColA0, uColA1, pow(aSeed.y, 3.0));
    vec3 c1 = mix(uColB0, uColB1, pow(aSeed.y, 3.0));
    // Densità come una superficie vera: zone più piene e più luminose, zone rade.
    float dens = 0.45 + 0.8 * smoothstep(-0.25, 0.45, noise(pos * 0.55 + 4.0));
    vColor = mix(c0, c1, ff) * (0.6 + 0.8 * pow(aSeed.x, 6.0)) * dens;
    // Pochi grani molto luminosi, la maggior parte appena percettibile: la luce nasce dalla densità.
    float lift = (k == 0 ? mix(5.0, 1.0, ff) : 1.0) * (k == 1 || k == 2 ? 1.25 : 1.0);
    vAlpha = mix(a0, a1, ff) * (0.1 + 0.55 * pow(aSeed.x, 8.0)) * lift * dens / (1.0 + coc * 2.5);
    vAlpha = mix(vAlpha, mix(a0, a1, ff) * 0.55 / (1.0 + coc * 1.2), vPebble);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPebble;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    float disc = smoothstep(0.5, 0.18, r);
    vec3 col = vColor;
    if (vPebble > 0.5) {
      // Sasso: una piccola sfera illuminata da una luce calda in alto a sinistra.
      disc = smoothstep(0.5, 0.44, r);
      vec3 n = vec3(c * 2.0, sqrt(max(0.0, 1.0 - 4.0 * r * r)));
      float dif = max(0.0, dot(n, normalize(vec3(-0.5, 0.6, 0.65))));
      float spec = pow(max(0.0, dot(n, normalize(vec3(-0.3, 0.4, 1.0)))), 24.0);
      col = vColor * (0.12 + 0.95 * dif) + vec3(1.0, 0.85, 0.6) * spec * 0.6;
    }
    if (disc * vAlpha < 0.01) discard;
    gl_FragColor = vec4(col, disc * vAlpha);
  }
`;

const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }
`;

// Lo sfondo: dal nero alla nebbia, all'atmosfera, al paesaggio, alla luce. Mai a blocchi.
const BG_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uPhase;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uSky; uniform vec3 uHorizon; uniform vec3 uGround;
  ${NOISE}
  void main() {
    vec2 uv = vUv;
    float land = smoothstep(4.2, 5.2, uPhase) * (1.0 - smoothstep(6.0, 6.0, uPhase) * 0.4); // paesaggio da metà percorso
    float hz = 0.42 + 0.05 * noise(vec3(uv.x * 3.0 * uAspect, 0.0, 1.0)) * land
             + 0.035 * noise(vec3(uv.x * 9.0 * uAspect, 2.0, 0.0)) * land;
    float sky = smoothstep(hz - 0.02, 0.95, uv.y);
    vec3 col = mix(uHorizon, uSky, sky);
    // sotto l'orizzonte: terra, con una sagoma di colline che appare solo verso il tramonto
    float below = smoothstep(hz + 0.005, hz - 0.03, uv.y);
    col = mix(col, uGround, below * mix(0.55, 1.0, land));
    // nebbia volumetrica che scorre lentamente
    float fog = noise(vec3(uv * vec2(2.0 * uAspect, 3.0), uTime * 0.02)) * 0.5 + 0.5;
    col += uHorizon * fog * 0.18 * smoothstep(0.6, 2.0, uPhase);
    // luce volumetrica: un alone caldo dietro la materia, più forte nel ricordo e nell'espansione
    float vol = smoothstep(0.4, 1.2, uPhase) * (1.0 - smoothstep(4.6, 5.4, uPhase) * 0.6);
    float dv = length((uv - vec2(0.62, 0.55)) * vec2(uAspect * 0.7, 1.0));
    col += uHorizon * 1.6 * vol * smoothstep(0.75, 0.0, dv) * (0.75 + 0.25 * noise(vec3(uv * 4.0, uTime * 0.05)));
    // un sole basso solo nella sintesi
    float sun = smoothstep(4.8, 5.4, uPhase) * (1.0 - smoothstep(5.8, 6.0, uPhase));
    float d = length((uv - vec2(0.72, hz + 0.03)) * vec2(uAspect, 1.0));
    col += vec3(1.0, 0.75, 0.45) * sun * (smoothstep(0.05, 0.0, d) + 0.35 * smoothstep(0.5, 0.0, d));
    // vignettatura e grana leggera
    float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(uAspect * 0.8, 1.0)));
    col *= mix(0.55, 1.0, vig);
    float g = fract(sin(dot(uv * 1000.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.035;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Le inquadrature delle sette fasi: posizione camera, punto guardato, apertura del fuoco.
const CAM: { pos: [number, number, number]; look: [number, number, number]; focus: number }[] = [
  { pos: [0, 0.5, 26], look: [0, 0, 0], focus: 14 }, // nascita: lontano, nel buio
  { pos: [1.2, 0.8, 9], look: [0, 0.2, 0], focus: 9 }, // ricordo: zoom in sulla massa
  { pos: [0.5, -2.2, 11], look: [0.5, -1.6, 0], focus: 11 }, // salto: la camera scende verso il suolo
  { pos: [-3.5, -1.2, 12], look: [1, -0.8, -1], focus: 12 }, // espansione: leggero pan sull'onda
  { pos: [1.5, 0, 18], look: [0, -0.2, -1], focus: 17 }, // composizione: zoom out, gli strati interi
  { pos: [0, 2.2, 15], look: [0, 0, 0], focus: 15 }, // sintesi: la forma intera, appena dall'alto
  { pos: [0, 1, 24], look: [0, 0, -4], focus: 30 }, // continua: si arretra, i granuli escono dai bordi
];

// Il suolo: una base di particelle sotto la materia, per sentire che la camera avanza nello spazio.
const GROUND_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(p.x * 0.35 + uTime * 0.25) * 0.08 + cos(p.z * 0.3 + uTime * 0.2) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    gl_PointSize = uSize * (24.0 / depth);
    gl_Position = projectionMatrix * mv;
    // si spegne in lontananza e sotto i piedi della camera
    vAlpha = smoothstep(70.0, 18.0, depth) * smoothstep(1.5, 6.0, depth);
  }
`;
const GROUND_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * uOpacity * smoothstep(0.5, 0.1, r));
  }
`;

// I nomi: un secondo sistema di particelle. Da polvere sparsa si compongono nel titolo e si disfano.
const NAME_VERT = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec4 aRand;
  uniform float uForm;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;
  ${NOISE}
  void main() {
    vec3 dir = normalize(aRand.xyz - 0.5 + 0.0001);
    vec3 scatter = aTarget + dir * (5.0 + aRand.w * 9.0);
    float f = smoothstep(0.0, 1.0, clamp(uForm * 1.45 - aRand.w * 0.45, 0.0, 1.0));
    vec3 p = mix(scatter, aTarget, f);
    p += flow(p * 0.4 + uTime * 0.08) * (0.06 + (1.0 - f) * 0.9);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.7 + aRand.z * 0.8) * (22.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vAlpha = (0.25 + 0.75 * f) * smoothstep(0.0, 0.25, uForm);
  }
`;
const NAME_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.1, r) * 0.95);
  }
`;

export function createMateria(canvas: HTMLCanvasElement, opts: { mobile: boolean; names?: string[] }): Materia {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.mobile ? 52 : 36, 1, 0.1, 200);

  // Sfondo
  const bgUniforms = {
    uPhase: { value: 0 },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uSky: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
  };
  const bg = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms: bgUniforms, depthWrite: false, depthTest: false }),
  );
  bg.frustumCulled = false;
  bg.renderOrder = -1;
  scene.add(bg);

  // Materia
  const COUNT = opts.mobile ? 60000 : 190000;
  const geo = new THREE.BufferGeometry();
  const seeds = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT * 4; i++) seeds[i] = Math.random();
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3)); // posizioni calcolate nello shader
  const pUniforms = {
    uPhase: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: opts.mobile ? 1.5 : 1.15 },
    uFocus: { value: 12 },
    uAperture: { value: opts.mobile ? 0.0 : 0.09 },
    uColA0: { value: new THREE.Color() },
    uColA1: { value: new THREE.Color() },
    uColB0: { value: new THREE.Color() },
    uColB1: { value: new THREE.Color() },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    uniforms: pUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // Suolo
  const gStep = opts.mobile ? 0.75 : 0.42;
  const gPts: number[] = [];
  for (let x = -40; x <= 40; x += gStep) for (let z = -60; z <= 30; z += gStep) gPts.push(x + (Math.random() - 0.5) * gStep * 0.6, -3.7, z + (Math.random() - 0.5) * gStep * 0.6);
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute("position", new THREE.Float32BufferAttribute(gPts, 3));
  const gUniforms = { uTime: { value: 0 }, uSize: { value: opts.mobile ? 1.9 : 1.6 }, uColor: { value: new THREE.Color() }, uOpacity: { value: 0 } };
  const gMat = new THREE.ShaderMaterial({ vertexShader: GROUND_VERT, fragmentShader: GROUND_FRAG, uniforms: gUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const ground = new THREE.Points(gGeo, gMat);
  ground.frustumCulled = false;
  scene.add(ground);

  // Nomi: agganciati alla camera, ruotano nello spazio davanti a chi guarda.
  scene.add(camera);
  const namesGroup = new THREE.Group();
  namesGroup.position.set(opts.mobile ? 0 : 1.4, opts.mobile ? 2.2 : 0.7, -14);
  camera.add(namesGroup);
  const nUniforms = { uForm: { value: 0 }, uTime: { value: 0 }, uSize: { value: opts.mobile ? 1.3 : 1.0 }, uColor: { value: new THREE.Color(0xffd6a0) } };
  const nMat = new THREE.ShaderMaterial({ vertexShader: NAME_VERT, fragmentShader: NAME_FRAG, uniforms: nUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const nameMeshes: (THREE.Points | null)[] = (opts.names ?? []).map(() => null);
  const cap = opts.mobile ? 2600 : 6500;
  function buildName(i: number) {
    const text = opts.names![i];
    const c = document.createElement("canvas");
    c.width = 1400;
    c.height = 260;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff";
    x.font = '400 170px "Playfair Display", Georgia, serif';
    x.textBaseline = "middle";
    const w = Math.min(c.width - 20, x.measureText(text).width);
    x.fillText(text, (c.width - w) / 2, c.height / 2, c.width - 20);
    const data = x.getImageData(0, 0, c.width, c.height).data;
    const px: number[] = [];
    for (let yy = 0; yy < c.height; yy += 2) for (let xx = 0; xx < c.width; xx += 2) if (data[(yy * c.width + xx) * 4 + 3] > 120) px.push(xx, yy);
    const n = Math.min(cap, px.length / 2);
    const worldW = opts.mobile ? 5.2 : 8.2;
    const k = worldW / Math.max(w, 400);
    const tgt = new Float32Array(n * 3);
    const rnd = new Float32Array(n * 4);
    for (let j = 0; j < n; j++) {
      const q = Math.floor(Math.random() * (px.length / 2));
      tgt[j * 3] = (px[q * 2] - c.width / 2) * k;
      tgt[j * 3 + 1] = -(px[q * 2 + 1] - c.height / 2) * k;
      tgt[j * 3 + 2] = (Math.random() - 0.5) * 0.25;
      for (let r = 0; r < 4; r++) rnd[j * 4 + r] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(tgt, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 4));
    const mesh = new THREE.Points(g, nMat);
    mesh.frustumCulled = false;
    mesh.visible = false;
    namesGroup.add(mesh);
    nameMeshes[i] = mesh;
  }
  let fontsReady = false;
  (document.fonts?.load('400 170px "Playfair Display"') ?? Promise.resolve()).finally(() => void (fontsReady = true));
  const nameState = { i: -1, form: 0, rot: 0 };

  let phase = 0;
  let shown = -1;
  const tmp = new THREE.Color();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const smooth = (t: number) => t * t * (3 - 2 * t);

  function apply(t: number) {
    const p = Math.min(6, Math.max(0, t));
    const k = Math.min(5, Math.floor(p));
    const f = p - k;
    const e = smooth(f);
    pUniforms.uPhase.value = p;
    bgUniforms.uPhase.value = p;
    const A = PAL[k];
    const B = PAL[k + 1];
    pUniforms.uColA0.value.set(A[0]);
    pUniforms.uColA1.value.set(A[1]);
    pUniforms.uColB0.value.set(B[0]);
    pUniforms.uColB1.value.set(B[1]);
    bgUniforms.uSky.value.set(A[2]).lerp(tmp.set(B[2]), e);
    bgUniforms.uHorizon.value.set(A[3]).lerp(tmp.set(B[3]), e);
    bgUniforms.uGround.value.set(A[4]).lerp(tmp.set(B[4]), e);
    // Camera: inquadrature interpolate con inerzia (l'inerzia vera arriva dallo scrub dello scroll)
    const ca = CAM[k];
    const cb = CAM[k + 1];
    v1.fromArray(ca.pos).lerp(v2.fromArray(cb.pos), e);
    camera.position.copy(v1);
    v1.fromArray(ca.look).lerp(v2.fromArray(cb.look), e);
    camera.lookAt(v1);
    pUniforms.uFocus.value = ca.focus + (cb.focus - ca.focus) * e;
    gUniforms.uColor.value.set(A[1]).lerp(tmp.set(B[1]), e).multiplyScalar(0.55);
    gUniforms.uOpacity.value = Math.min(1, p * 1.2) * (p > 5.55 ? 0.55 : 0.95);
    nUniforms.uColor.value.set(A[1]).lerp(tmp.set(B[1]), e).lerp(tmp.set(0xffffff), 0.35);
    // Verso la luce quasi bianca la materia smette di emettere luce e diventa polvere controluce.
    const normal = p > 5.55;
    if (normal !== (mat.blending === THREE.NormalBlending)) {
      mat.blending = normal ? THREE.NormalBlending : THREE.AdditiveBlending;
      mat.needsUpdate = true;
      gMat.blending = mat.blending;
      gMat.needsUpdate = true;
    }
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bgUniforms.uAspect.value = w / h;
  }

  let raf = 0;
  let visible = true;
  const t0 = performance.now();
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const time = (performance.now() - t0) / 1000;
    pUniforms.uTime.value = time;
    bgUniforms.uTime.value = time;
    gUniforms.uTime.value = time;
    nUniforms.uTime.value = time;
    // un solo nome alla volta
    const ni = nameState.i;
    if (ni >= 0 && fontsReady && !nameMeshes[ni]) buildName(ni);
    nameMeshes.forEach((mesh, j) => {
      if (mesh) mesh.visible = j === ni && nameState.form > 0.01;
    });
    nUniforms.uForm.value = nameState.form;
    namesGroup.rotation.set(Math.sin(nameState.rot * 0.7) * 0.18, nameState.rot, 0);
    if (phase !== shown) {
      apply(phase);
      shown = phase;
    }
    renderer.render(scene, camera);
  }
  const onVis = () => void (visible = document.visibilityState === "visible");
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("resize", resize);
  resize();
  apply(0);
  loop();

  return {
    setPhase(p) {
      phase = p;
    },
    setName(i, form, rot) {
      nameState.i = i;
      nameState.form = form;
      nameState.rot = rot;
    },
    destroy() {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      geo.dispose();
      gGeo.dispose();
      nameMeshes.forEach((m) => m?.geometry.dispose());
      renderer.dispose();
    },
  };
}
