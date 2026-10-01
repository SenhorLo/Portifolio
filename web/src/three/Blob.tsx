import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cena do hero: uma massa orgânica iridescente (esfera deformada por ruído simplex,
 * com iridescência por fresnel) cercada por uma poeira fina de partículas.
 * O cursor inclina a cena; o scroll afasta a câmera.
 */

export type SceneProps = {
  /** Progresso do scroll da página inteira (0 no topo, 1 no fim). */
  progress: RefObject<number>;
  pointer: RefObject<{ x: number; y: number }>;
};

/**
 * Percurso da massa pela página: [progresso, x, y, escala].
 * Os pontos acompanham as seções — hero à direita, experiência à esquerda,
 * projetos de volta à direita, e assim por diante.
 */
const PATH: [number, number, number, number][] = [
  [0.0, -2.55, 0.05, 0.58],
  [0.11, 4.2, 0.9, 0.72],
  [0.2, 4.2, -0.9, 0.7],
  [0.31, -3.4, -0.75, 0.9],
  [0.42, -3.6, -0.5, 0.85],
  [0.56, 4.0, -0.5, 0.75],
  [0.7, -3.4, 0.5, 0.85],
  [0.85, 2.8, 0.3, 0.8],
  [1.0, 0.0, 0.15, 0.55],
];

const smooth = (t: number) => t * t * (3 - 2 * t);

// Interpola o percurso e devolve [x, y, escala] para um progresso qualquer.
function sample(p: number): [number, number, number] {
  const c = Math.min(Math.max(p, 0), 1);
  for (let i = 0; i < PATH.length - 1; i++) {
    const [p0, x0, y0, s0] = PATH[i];
    const [p1, x1, y1, s1] = PATH[i + 1];
    if (c <= p1) {
      const t = smooth((c - p0) / (p1 - p0));
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, s0 + (s1 - s0) * t];
    }
  }
  const last = PATH[PATH.length - 1];
  return [last[1], last[2], last[3]];
}

// Ruído simplex 3D (Ashima/webgl-noise), usado no vértice e no fragmento.
const NOISE = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying float vNoise;
  ${NOISE}

  // Deslocamento em duas oitavas: massa lenta + ondulação fina.
  float displace(vec3 p) {
    float slow = snoise(p * 0.9 + vec3(0.0, uTime * 0.12, uTime * 0.08));
    float fine = snoise(p * 2.4 - vec3(uTime * 0.18, 0.0, 0.0)) * 0.35;
    return slow + fine;
  }

  void main() {
    vec3 n = normalize(position);
    float d = displace(n);
    vNoise = d;
    vec3 pos = position * (1.0 + d * uAmp);
    vLocal = n;

    // Normal por diferenças finitas; a base tangente evita a degeneração nos polos.
    float e = 0.06;
    vec3 up = abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(up, n));
    vec3 t2 = cross(n, t1);
    vec3 na = normalize(n + t1 * e);
    vec3 nb = normalize(n + t2 * e);
    vec3 pa = na * (1.0 + displace(na) * uAmp) * 1.5;
    vec3 pb = nb * (1.0 + displace(nb) * uAmp) * 1.5;
    vNormal = normalize(normalMatrix * normalize(cross(pa - pos, pb - pos)));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying float vNoise;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);

    // Duas luzes: chave magenta em cima à direita, contraluz azul embaixo à esquerda.
    vec3 keyDir = normalize(vec3(0.55, 0.75, 0.45));
    vec3 rimDir = normalize(vec3(-0.7, -0.35, 0.25));
    float key = clamp(dot(n, keyDir), 0.0, 1.0);
    float rim = clamp(dot(n, rimDir), 0.0, 1.0);

    // Corpo: índigo profundo embaixo, violeta em cima (rampa pela normal local).
    vec3 body = mix(vec3(0.05, 0.015, 0.14), vec3(0.28, 0.07, 0.52), smoothstep(-0.7, 0.8, vLocal.y + vNoise * 0.25));
    vec3 col = body;
    col += vec3(0.95, 0.24, 0.62) * pow(key, 2.2) * 0.85;
    col += vec3(0.30, 0.34, 1.0) * pow(rim, 3.0) * 0.5;
    col += vec3(1.0, 0.55, 0.85) * fres * 0.45;
    col += vec3(1.0, 0.95, 1.0) * pow(fres, 8.0) * 0.6;

    // Especular estreito, como verniz.
    vec3 h = normalize(keyDir + v);
    col += vec3(1.0, 0.9, 1.0) * pow(clamp(dot(n, h), 0.0, 1.0), 90.0) * 0.9;
    float spec2 = pow(clamp(dot(reflect(-v, n), normalize(vec3(sin(uTime * 0.25) * 0.6, 0.5, 0.8))), 0.0, 1.0), 34.0);
    col += vec3(0.75, 0.85, 1.0) * spec2 * 0.35;

    col = 1.0 - exp(-col * 1.45);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Mass({ progress, pointer, mobile }: SceneProps & { mobile: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTime: { value: 0 }, uAmp: { value: 0.4 } },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, mobile ? 64 : 128), [mobile]);
  useEffect(() => () => void (geometry.dispose(), material.dispose()), [geometry, material]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const t = (material.uniforms.uTime.value += d);
    const g = group.current;
    if (!g) return;

    g.rotation.y += d * 0.12;
    const tx = pointer.current.y * 0.28;
    const tz = -pointer.current.x * 0.22;
    g.rotation.x += (tx - g.rotation.x) * 0.04;
    g.rotation.z += (tz - g.rotation.z) * 0.04;

    // Alvo vindo do percurso + uma flutuação lenta, para nunca ficar parado.
    const [rawX, py, ps] = sample(progress.current);
    // Em telas estreitas o deslocamento lateral é reduzido para a massa não sair de cena.
    const limit = viewport.width / 2;
    const px = THREE.MathUtils.clamp(rawX * Math.min(1, limit / 4.6), -limit * 0.55, limit * 0.55);
    // No celular a massa sobe: o texto ocupa o centro da tela.
    const offsetY = mobile ? 1.35 : 0;
    const floatX = Math.sin(t * 0.16) * 0.22;
    const floatY = Math.sin(t * 0.21 + 1.3) * 0.26;
    const scale = ps * (mobile ? 0.62 : 1);
    g.position.x += (px + floatX - g.position.x) * 0.07;
    g.position.y += (py + offsetY + floatY - g.position.y) * 0.07;
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * 0.07);
  });

  return (
    <group ref={group} position={[-2.55, 0, 0]}>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

// Poeira fina em volta da massa, para dar escala.
function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y -= d * 0.02;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.03} color="#e9b9ff" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function Blob({ progress, pointer, mobile, paused }: SceneProps & { mobile: boolean; paused: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Pausada, a cena renderiza um único quadro — inclusive com movimento reduzido.
      frameloop={paused ? "demand" : "always"}
      aria-hidden="true"
    >
      <Dust count={mobile ? 250 : 700} />
      <Mass progress={progress} pointer={pointer} mobile={mobile} />
    </Canvas>
  );
}
